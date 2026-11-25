import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/resources'
import { resources, ui } from '../../data/content'
import { useResource } from '../../hooks/useResource'
import { useToast } from '../../hooks/useToast'
import { PlusIcon, SearchIcon } from '../icons'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import { ConfirmDelete } from '../ui/Modal'
import { SkeletonRows } from '../ui/Skeleton'

export function Cell({ column, record }) {
  const value = column.get(record)
  if (column.pill) return <Badge status={value} />
  return value === '' || value == null ? ui.none : value
}

function RowActions({ name, record, onDelete }) {
  const config = resources[name]
  return (
    <div className="row-actions">
      <Button variant="ghost" size="sm" to={`/${name}/${record.id}`}>
        {ui.view}
      </Button>
      {config.canEdit !== false && (
        <Button variant="ghost" size="sm" to={`/${name}/${record.id}/edit`}>
          {ui.edit}
        </Button>
      )}
      <Button variant="ghost" size="sm" className="btn--delete" onClick={() => onDelete(record)}>
        {ui.delete}
      </Button>
    </div>
  )
}

export default function ResourceList({ name }) {
  const config = resources[name]
  const toast = useToast()
  const { data, error, loading, reload } = useResource(name)
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const columns = config.columns.filter((c) => !c.detailOnly)
  const needle = query.trim().toLowerCase()
  const rows = (data ?? []).filter(
    (r) => !needle || config.columns.some((c) => String(c.get(r) ?? '').toLowerCase().includes(needle)),
  )

  async function confirmDelete() {
    setBusy(true)
    try {
      await api[name].remove(target.id)
      toast.success(ui.deleted(config.singular))
      setTarget(null)
      reload()
    } catch (e) {
      toast.error(e.message)
      setTarget(null)
    } finally {
      setBusy(false)
    }
  }

  let content
  if (loading && !data) {
    content = <SkeletonRows />
  } else if (error) {
    content = (
      <EmptyState
        tone="error"
        title={ui.errorTitle}
        text={error.message}
        action={<Button variant="outline" onClick={reload}>{ui.retry}</Button>}
      />
    )
  } else if (!data.length) {
    content = (
      <EmptyState
        title={ui.emptyTitle}
        text={config.intro}
        action={<Button to={`/${name}/new`}>{ui.emptyAction}</Button>}
      />
    )
  } else if (!rows.length) {
    content = <EmptyState title={ui.noMatches} />
  } else {
    content = (
      <>
        <div className="table-wrap">
          <table className="table">
            <caption className="sr-only">{config.plural}</caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th scope="col" key={c.label}>
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="table__actions">
                  {ui.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => (
                    <td key={c.label} data-primary={c.primary || undefined}>
                      {c.primary ? (
                        <Link to={`/${name}/${r.id}`}>
                          <Cell column={c} record={r} />
                        </Link>
                      ) : (
                        <Cell column={c} record={r} />
                      )}
                    </td>
                  ))}
                  <td className="table__actions">
                    <RowActions name={name} record={r} onDelete={setTarget} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="cards">
          {rows.map((r) => (
            <li className="card record-card" key={r.id}>
              <dl>
                {columns.map((c) => (
                  <div key={c.label}>
                    <dt className="label">{c.label}</dt>
                    <dd>
                      <Cell column={c} record={r} />
                    </dd>
                  </div>
                ))}
              </dl>
              <RowActions name={name} record={r} onDelete={setTarget} />
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <>
      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search__icon" />
          <label htmlFor="list-search" className="sr-only">
            {ui.search}
          </label>
          <input
            id="list-search"
            type="search"
            className="input"
            placeholder={ui.searchHint}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button to={`/${name}/new`}>
          <PlusIcon width={16} height={16} /> {ui.add}
        </Button>
      </div>
      {content}
      {target && (
        <ConfirmDelete label={config.title(target)} busy={busy} onCancel={() => setTarget(null)} onConfirm={confirmDelete} />
      )}
    </>
  )
}
