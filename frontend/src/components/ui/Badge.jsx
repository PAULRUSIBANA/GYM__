import { statusLabels } from '../../data/content'

// Small outlined pill. Pass `status` for a session-status pill, or children for a plain badge.
export default function Badge({ status, children }) {
  return (
    <span className="badge" data-status={status}>
      {status && <span className="badge__dot" aria-hidden="true" />}
      {children ?? statusLabels[status] ?? status}
    </span>
  )
}
