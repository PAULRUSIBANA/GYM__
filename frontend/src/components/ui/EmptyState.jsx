// Used for empty lists, load errors and unknown routes. `action` is a ready-made <Button>.
export default function EmptyState({ title, text, action, tone }) {
  return (
    <div className="empty" data-tone={tone} role={tone === 'error' ? 'alert' : undefined}>
      <h2 className="empty__title">{title}</h2>
      {text && <p className="empty__text">{text}</p>}
      {action}
    </div>
  )
}
