import { features } from '../../data/content'
import { useInView } from '../../hooks/useInView'

export default function FeatureStrip() {
  const [ref, seen] = useInView()
  return (
    <section className="section container" aria-labelledby="features-title">
      <p className="label">{features.eyebrow}</p>
      <h2 id="features-title" className="section__title">
        {features.title}
      </h2>
      <ol className={`features reveal${seen ? ' is-visible' : ''}`} ref={ref}>
        {features.items.map((item, i) => (
          <li className="card feature" key={item.title}>
            <span className="feature__num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
