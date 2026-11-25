import { ui } from '../../data/content'

export function Skeleton({ width = '100%', height = '1rem' }) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="skeleton-rows" role="status" aria-label={ui.loading}>
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton-row" key={i}>
          <Skeleton width="18%" />
          <Skeleton width="30%" />
          <Skeleton width="24%" />
          <Skeleton width="12%" />
        </div>
      ))}
    </div>
  )
}
