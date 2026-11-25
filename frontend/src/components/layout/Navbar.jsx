import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, resourceKeys, resources, site } from '../../data/content'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { LogoMark, CloseIcon, MenuIcon } from '../icons'
import Button from '../ui/Button'

function Logo() {
  return (
    <Link to="/" className="logo">
      <LogoMark />
      <span>{site.name}</span>
    </Link>
  )
}

function MobileMenu({ onClose }) {
  const ref = useRef(null)
  useFocusTrap(ref, onClose)
  return (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label={nav.mobileLabel} ref={ref}>
      <div className="mobile-menu__bar">
        <Logo />
        <button type="button" className="icon-btn" onClick={onClose} aria-label={nav.menuClose}>
          <CloseIcon />
        </button>
      </div>
      <nav aria-label={nav.mobileLabel}>
        <ul className="mobile-menu__list">
          {resourceKeys.map((key) => (
            <li key={key}>
              <NavLink to={`/${key}`} onClick={onClose}>
                {resources[key].nav}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Button variant="light" to={site.addTo} onClick={onClose}>
        {site.addLabel}
      </Button>
    </div>
  )
}

export default function Navbar() {
  // Remember which path the menu was opened on so it closes itself when the route changes.
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Logo />
        <nav className="navbar__links" aria-label={nav.primaryLabel}>
          <ul>
            {resourceKeys.map((key) => (
              <li key={key}>
                <NavLink to={`/${key}`}>{resources[key].nav}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Button variant="light" size="sm" to={site.addTo} className="navbar__cta">
          {site.addLabel}
        </Button>
        <button
          type="button"
          className="icon-btn navbar__burger"
          onClick={() => setOpenOn(pathname)}
          aria-label={nav.menuOpen}
          aria-expanded={open}
        >
          <MenuIcon />
        </button>
      </div>
      {open && <MobileMenu onClose={() => setOpenOn(null)} />}
    </header>
  )
}
