import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/resources'
import { resources, ui } from '../../data/content'
import { useResource } from '../../hooks/useResource'
import { useToast } from '../../hooks/useToast'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = () => new Date().toLocaleDateString('en-CA')

function isVisible(field, mode) {
  return !(field.editOnly && mode === 'create')
}

function isLocked(field, mode) {
  return mode === 'edit' && Boolean(field.lockedOnEdit)
}

function initialValues(config, record) {
  const values = {}
  for (const f of config.fields) {
    if (f.type === 'relation') values[f.name] = record?.[f.name]?.id ?? ''
    else if (f.type === 'relation-multi') values[f.name] = (record?.[f.name] ?? []).map((d) => d.id)
    else values[f.name] = record?.[f.name] ?? ''
  }
  return values
}

function validate(field, value, mode) {
  if (!isVisible(field, mode) || isLocked(field, mode)) return ''
  const empty = Array.isArray(value) ? !value.length : String(value ?? '').trim() === ''
  if (empty) return field.required ? ui.required : ''
  if (field.type === 'email' && !EMAIL.test(value)) return ui.email
  if (field.type === 'number' && field.min != null && Number(value) < field.min) return ui.min(field.min)
  if (field.type === 'date' && field.noPastOnCreate && mode === 'create' && value < today()) return ui.pastDate
  return ''
}

function RelationSelect({ field, id, value, invalid, describedBy, disabled, onChange, onBlur }) {
  const { data, error, loading } = useResource(field.relation)
  const target = resources[field.relation]
  const options = (data ?? []).filter(field.filter ?? (() => true))
  return (
    <>
      <select
        id={id}
        className="input"
        value={value}
        disabled={disabled || loading || Boolean(error)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      >
        <option value="">{loading ? ui.loading : ui.chooseOne}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {target.title(o)}
          </option>
        ))}
      </select>
      {error && <p className="field__error">{error.message}</p>}
      {!loading && !error && !options.length && (
        <p className="field__hint">
          {ui.noRelation(target.plural)} <Link to={`/${field.relation}/new`}>{ui.add}</Link>
        </p>
      )}
    </>
  )
}

function RelationChecks({ field, id, value, initial, mode, onChange }) {
  const { data, error, loading } = useResource(field.relation)
  const target = resources[field.relation]
  const locked = (key) => mode === 'edit' && field.addOnlyOnEdit && initial.includes(key)
  const toggle = (key) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key])
  if (loading) return <Skeleton width="50%" height="2rem" />
  if (error) return <p className="field__error">{error.message}</p>
  if (!data.length) {
    return (
      <p className="field__hint">
        {ui.noRelation(target.plural)} <Link to={`/${field.relation}/new`}>{ui.add}</Link>
      </p>
    )
  }
  return (
    <div className="checks" id={id}>
      {data.map((o) => (
        <label className="check" key={o.id}>
          <input type="checkbox" checked={value.includes(o.id)} disabled={locked(o.id)} onChange={() => toggle(o.id)} />
          <span>{target.title(o)}</span>
        </label>
      ))}
    </div>
  )
}

function Field({ field, mode, record, value, initial, error, onChange, onBlur }) {
  const id = `f-${field.name}`
  const errorId = `${id}-error`
  const hint = isLocked(field, mode)
    ? ui.lockedHint
    : field.addOnlyOnEdit && mode === 'edit'
      ? ui.addOnlyHint
      : field.hint
  const describedBy = [error && errorId, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  const common = {
    id,
    value,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    disabled: isLocked(field, mode),
    onBlur,
    onChange: (e) => onChange(e.target.value),
  }

  let control
  if (field.type === 'relation') {
    control = (
      <RelationSelect
        field={field}
        id={id}
        value={value}
        invalid={Boolean(error)}
        describedBy={describedBy}
        disabled={isLocked(field, mode)}
        onChange={onChange}
        onBlur={onBlur}
      />
    )
  } else if (field.type === 'relation-multi') {
    control = <RelationChecks field={field} id={id} value={value} initial={initial} mode={mode} onChange={onChange} />
  } else if (field.type === 'select') {
    const options = typeof field.options === 'function' ? field.options(record) : field.options
    control = (
      <select {...common} className="input" disabled={common.disabled || options.length < 2}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  } else if (field.type === 'textarea') {
    control = <textarea {...common} className="input" rows={4} />
  } else {
    control = (
      <input
        {...common}
        className="input"
        type={field.type}
        min={field.type === 'date' && mode === 'create' && field.noPastOnCreate ? today() : field.min}
        autoComplete="off"
      />
    )
  }

  const Wrapper = field.type === 'relation-multi' ? 'fieldset' : 'div'
  const Label = field.type === 'relation-multi' ? 'legend' : 'label'
  return (
    <Wrapper className="field">
      <Label className="field__label" {...(Label === 'label' ? { htmlFor: id } : {})}>
        {field.label}
        {field.required && <span className="field__req" aria-hidden="true"> *</span>}
      </Label>
      {control}
      {hint && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </Wrapper>
  )
}

function FormBody({ name, mode, id, record }) {
  const config = resources[name]
  const navigate = useNavigate()
  const toast = useToast()
  const [initial] = useState(() => initialValues(config, record))
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const fields = config.fields.filter((f) => isVisible(f, mode))

  const setValue = (field, value) => {
    setValues((v) => ({ ...v, [field.name]: value }))
    if (errors[field.name]) setErrors((e) => ({ ...e, [field.name]: validate(field, value, mode) }))
  }
  const blur = (field) => setErrors((e) => ({ ...e, [field.name]: validate(field, values[field.name], mode) }))

  async function onSubmit(event) {
    event.preventDefault()
    const found = {}
    for (const f of fields) {
      const message = validate(f, values[f.name], mode)
      if (message) found[f.name] = message
    }
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      setFormError(ui.formError)
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    setFormError('')
    setSaving(true)
    try {
      if (mode === 'edit') await api[name].update(id, values, record)
      else await api[name].create(values)
      toast.success(ui.saved(config.singular))
      navigate(mode === 'edit' ? `/${name}/${id}` : `/${name}`)
    } catch (e) {
      setFormError(e.message)
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card form" onSubmit={onSubmit} noValidate>
      {formError && (
        <p className="form__error" role="alert">
          {formError}
        </p>
      )}
      <div className="form__grid">
        {fields.map((f) => (
          <Field
            key={f.name}
            field={f}
            mode={mode}
            record={record}
            value={values[f.name]}
            initial={initial[f.name]}
            error={errors[f.name]}
            onChange={(v) => setValue(f, v)}
            onBlur={() => blur(f)}
          />
        ))}
      </div>
      <div className="form__actions">
        <Button type="submit" disabled={saving}>
          {saving ? ui.saving : ui.save}
        </Button>
        <Button variant="outline" to={mode === 'edit' ? `/${name}/${id}` : `/${name}`}>
          {ui.cancel}
        </Button>
      </div>
    </form>
  )
}

function EditLoader({ name, id }) {
  const { data, error, loading, reload } = useResource(name, id)
  if (loading) return <Skeleton height="14rem" />
  if (error) {
    return (
      <EmptyState
        tone="error"
        title={ui.errorTitle}
        text={error.message}
        action={<Button variant="outline" onClick={reload}>{ui.retry}</Button>}
      />
    )
  }
  return <FormBody name={name} mode="edit" id={id} record={data} />
}

export default function ResourceForm({ name, id }) {
  return id ? <EditLoader name={name} id={id} /> : <FormBody name={name} mode="create" />
}
