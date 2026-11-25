import { Link } from 'react-router-dom'
import { preview, resources } from '../../data/content'
import { useInView } from '../../hooks/useInView'
import { useResource } from '../../hooks/useResource'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

const config = resources['training-sessions']

export default function LivePreview() {
  const [ref, seen] = useInView()
  const { data, error, loading, reload } = useResource('training-sessions')
  const latest = (data ?? [])
    .toSorted((a, b) => String(b.sessionDate).localeCompare(String(a.sessionDate)))
    .slice(0, preview.count)

  let body
  if (loading) {
    body = Array.from({ length: preview.count }, (_, i) => (
      <li className="preview__row" key={i}>
        <Skeleton width="60%" />
      </li>
    ))
  } else if (error) {
    body = (
      <EmptyState
        tone="error"
        title={preview.error}
        text={error.message}
        action={<Button variant="outline" onClick={reload}>{preview.retry}</Button>}
      />
    )
  } else if (!latest.length) {
    body = (
      <EmptyState
        title={preview.empty}
        action={<Button to="/training-sessions/new">{preview.emptyAction}</Button>}
      />
    )
  } else {
    body = latest.map((s) => (
      <li className="preview__row" key={s.id}>
        <Link to={`/training-sessions/${s.id}`}>
          <span className="preview__main">{config.title(s)}</span>
          <span className="preview__sub">{config.columns[3].get(s)}</span>
        </Link>
        <Badge status={s.status} />
      </li>
    ))
  }

  return (
    <section className="section container" aria-labelledby="preview-title">
      <div className={`panel reveal${seen ? ' is-visible' : ''}`} ref={ref}>
        <div className="panel__head">
          <div>
            <p className="label">{preview.eyebrow}</p>
            <h2 id="preview-title" className="section__title section__title--sm">
              {preview.title}
            </h2>
          </div>
          <Button variant="outline" size="sm" to="/training-sessions">
            {preview.viewAll}
          </Button>
        </div>
        {loading || latest.length ? <ul className="preview">{body}</ul> : body}
      </div>
    </section>
  )
}
