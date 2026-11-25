import { ApiError, request } from './client'
import { errors, resourceKeys, resources as config } from '../data/content'

// Turn form values into the JSON body the backend entity expects.
function buildBody(name, values) {
  const body = {}
  for (const field of config[name].fields) {
    if (field.asParam || field.editOnly) continue
    const value = values[field.name]
    if (field.type === 'relation') {
      if (value) body[field.name] = { id: value }
    } else if (field.type === 'relation-multi') {
      body[field.name] = (value ?? []).map((id) => ({ id }))
    } else if (field.type === 'number') {
      if (value !== '' && value != null) body[field.name] = Number(value)
    } else {
      body[field.name] = String(value ?? '').trim()
    }
  }
  return body
}

function paramsFor(name, values) {
  const params = {}
  for (const field of config[name].fields) {
    if (field.asParam) params[field.name] = values[field.name]
  }
  return Object.keys(params).length ? params : undefined
}

function standard(name) {
  return {
    list: () => request(`/${name}/all`),
    get: (id) => request(`/${name}/${id}`),
    create: (values) =>
      request(`/${name}/save`, { method: 'POST', body: buildBody(name, values), params: paramsFor(name, values) }),
    update: (id, values) => request(`/${name}/update/${id}`, { method: 'PUT', body: buildBody(name, values) }),
    remove: (id) => request(`/${name}/delete/${id}`, { method: 'DELETE' }),
  }
}

const api = Object.fromEntries(resourceKeys.map((name) => [name, standard(name)]))

// PUT /update only changes some fields; the rest have their own endpoints.
const baseTrainerUpdate = api.trainers.update
api.trainers.update = async (id, values, previous) => {
  const message = await baseTrainerUpdate(id, values)
  if (values.studio && values.studio !== (previous.studio?.id ?? '')) {
    const studio = await request(`/studios/${values.studio}`)
    await request(`/trainers/${id}/studio`, { method: 'PATCH', params: { studioNumber: studio.studioNumber } })
  }
  const had = new Set((previous.disciplines ?? []).map((d) => d.id))
  const added = (values.disciplines ?? []).filter((d) => !had.has(d))
  if (added.length) await request(`/trainers/${id}/disciplines`, { method: 'PUT', body: added })
  return message
}

const baseSessionUpdate = api['training-sessions'].update
api['training-sessions'].update = async (id, values, previous) => {
  const message = await baseSessionUpdate(id, values)
  if (values.status && values.status !== previous.status) {
    // The backend only allows BOOKED -> CHECKED_IN -> FINISHED, so finishing a booked session checks it in first.
    const steps = previous.status === 'BOOKED' && values.status === 'FINISHED' ? ['CHECKED_IN', 'FINISHED'] : [values.status]
    for (const status of steps) {
      const result = await request(`/training-sessions/${id}/status`, { method: 'PATCH', params: { status } })
      if (!String(result).includes('successfully')) throw new ApiError(String(result), 400)
    }
  }
  return message
}

// The workout-log controller has no list-all, get-by-id or update: gather logs per member instead.
async function listWorkoutLogs() {
  const members = await request('/members/all')
  const groups = await Promise.all(
    members.map((m) => request(`/workout-logs/member/${encodeURIComponent(m.memberNumber)}`)),
  )
  return groups.flat()
}

api['workout-logs'].list = listWorkoutLogs
api['workout-logs'].get = async (id) => {
  const found = (await listWorkoutLogs()).find((log) => log.id === id)
  if (!found) throw new ApiError(errors.notFound, 404)
  return found
}
delete api['workout-logs'].update

export { api }
