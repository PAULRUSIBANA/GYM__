import { hero } from '../../data/content'
import { useResource } from '../../hooks/useResource'
import { ArrowRight } from '../icons'
import Button from '../ui/Button'

function Stat({ resource, label }) {
  const { data } = useResource(resource)
  return (
    <li className="hero__stat">
      <strong>{Array.isArray(data) ? data.length : hero.missing}</strong>
      <span>{label}</span>
    </li>
  )
}

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" role="presentation" aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="fog" aria-hidden="true">
        <span className="fog__layer fog__layer--1" />
        <span className="fog__layer fog__layer--2" />
        <span className="fog__layer fog__layer--3" />
      </div>

      <div className="container hero__content">
        <p className="pill-badge rise" style={{ '--delay': '0ms' }}>
          {hero.badge}
        </p>
        <h1 id="hero-title" className="hero__title rise" style={{ '--delay': '80ms' }}>
          {hero.lines.map((line) => (
            <span key={line} className="hero__line">
              {line}
            </span>
          ))}
          <span className="hero__line">
            {hero.accentPrefix} <em>{hero.accent}</em>
          </span>
        </h1>
        <p className="hero__subtitle rise" style={{ '--delay': '160ms' }}>
          {hero.subtitle}
        </p>
        <div className="hero__actions rise" style={{ '--delay': '240ms' }}>
          <Button to={hero.primary.to}>{hero.primary.label}</Button>
          <Button variant="outline" to={hero.secondary.to}>
            {hero.secondary.label} <ArrowRight width={16} height={16} />
          </Button>
        </div>
      </div>

      <div className="container hero__stats-wrap">
        <ul className="hero__stats rise" style={{ '--delay': '320ms' }} aria-label={hero.statsLabel}>
          {hero.stats.map((s) => (
            <Stat key={s.resource} {...s} />
          ))}
        </ul>
      </div>
    </section>
  )
}
