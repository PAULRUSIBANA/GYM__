import { cta } from '../../data/content'
import { useInView } from '../../hooks/useInView'
import Button from '../ui/Button'

export default function CtaBand() {
  const [ref, seen] = useInView()
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className={`container cta__inner reveal${seen ? ' is-visible' : ''}`} ref={ref}>
        <div>
          <h2 id="cta-title" className="cta__title">
            {cta.title}
          </h2>
          <p className="cta__text">{cta.text}</p>
        </div>
        <Button to={cta.button.to}>{cta.button.label}</Button>
      </div>
    </section>
  )
}
