import { errors } from '../data/content'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8086/api').replace(/\/$/, '')

const TIMEOUT_MS = 10_000

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// The Spring controllers return plain-text bodies for most responses, so parse JSON only when it is JSON.
function parseBody(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function messageFrom(data, status) {
  if (typeof data === 'string' && data.trim()) return data.trim()
  if (data && typeof data === 'object') {
    const text = data.message || data.error
    if (text && status < 500) return `${text} (HTTP ${status})`
  }
  if (status >= 500) return errors.server
  return errors.generic(status)
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const query = params ? `?${new URLSearchParams(params)}` : ''
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response
  try {
    response = await fetch(`${API_URL}${path}${query}`, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (error) {
    throw new ApiError(error.name === 'AbortError' ? errors.timeout : errors.network(API_URL))
  } finally {
    clearTimeout(timer)
  }

  const data = parseBody(await response.text())
  if (!response.ok) throw new ApiError(messageFrom(data, response.status), response.status)
  return data
}
