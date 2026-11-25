import { useId, useRef } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { ui } from '../../data/content'
import Button from './Button'

function Dialog({ title, children, onClose }) {
  const ref = useRef(null)
  const titleId = useId()
  useFocusTrap(ref, onClose)
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
        <h2 id={titleId} className="modal__title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default function Modal({ open, ...props }) {
  return open ? <Dialog {...props} /> : null
}

export function ConfirmDelete({ label, busy, onCancel, onConfirm }) {
  return (
    <Modal open title={ui.deleteTitle} onClose={busy ? () => {} : onCancel}>
      <p className="modal__text">{ui.deleteText(label)}</p>
      <div className="modal__actions">
        <Button variant="outline" onClick={onCancel} disabled={busy}>
          {ui.cancel}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={busy}>
          {busy ? ui.deleting : ui.delete}
        </Button>
      </div>
    </Modal>
  )
}
