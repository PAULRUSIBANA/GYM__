import { Link } from 'react-router-dom'
import { footer, resourceKeys, resources, site } from '../../data/content'
import { LogoMark } from '../icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link to="/" className="logo">
            <LogoMark />
            <span>{site.name}</span>
          </Link>
          <p className="footer__about">{footer.about}</p>
        </div>
        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className="label">
            {footer.navTitle}
          </h2>
          <ul className="footer__list">
            {resourceKeys.map((key) => (
              <li key={key}>
                <Link to={`/${key}`}>{resources[key].nav}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="label">{footer.contactTitle}</h2>
          <ul className="footer__list">
            {footer.contact.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="label">{footer.hoursTitle}</h2>
          <ul className="footer__list">
            {footer.hours.map((h) => (
              <li key={h.day} className="footer__hours">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer__bar">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <ul>
          {footer.legal.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
