import { ui } from '../data/content'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

export default function NotFound() {
  return (
    <section className="page container">
      <EmptyState
        title={ui.notFoundTitle}
        text={ui.notFoundText}
        action={<Button to="/">{ui.home}</Button>}
      />
    </section>
  )
}
