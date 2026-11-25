import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/resources'
import { resources, ui } from '../../data/content'
import { useResource } from '../../hooks/useResource'
import { useToast } from '../../hooks/useToast'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import { ConfirmDelete } from '../ui/Modal'
import { Skeleton } from '../ui/Skeleton'
import { Cell } from './ResourceList'

export default function ResourceDetail({ name, id }) {
  const config = resources[name]
  const navigate = useNavigate()
  const toast = useToast()
  const { data, error, loading, reload } = useResource(name, id)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  async function confirmDelete() {
    setBusy(true)
    try {
      await api[name].remove(id)
      toast.success(ui.deleted(config.singular))
      navigate(`/${name}`)
    } catch (e) {
      toast.error(e.message)
      setConfirming(false)
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="card detail" role="status" aria-label={ui.loading}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="detail__row">
            <Skeleton width="30%" height="0.75rem" />
            <Skeleton width="55%" />
          </div>
        ))}
      </div>
    )
  }

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

  return (
    <>
      <dl className="card detail">
        {config.columns.map((c) => (
          <div className="detail__row" key={c.label}>
            <dt className="label">{c.label}</dt>
            <dd>
              <Cell column={c} record={data} />
            </dd>
          </div>
        ))}
      </dl>
      <div className="detail__actions">
        {config.canEdit !== false && (
          <Button to={`/${name}/${id}/edit`}>{ui.edit}</Button>
        )}
        <Button variant="danger" onClick={() => setConfirming(true)}>
          {ui.delete}
        </Button>
      </div>
      {confirming && (
        <ConfirmDelete label={config.title(data)} busy={busy} onCancel={() => setConfirming(false)} onConfirm={confirmDelete} />
      )}
    </>
  )
}
