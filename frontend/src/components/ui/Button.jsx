import { Link } from 'react-router-dom'

// variant: primary | outline | light | ghost | danger. Renders a router Link when `to` is set.
export default function Button({ variant = 'primary', size = 'md', to, className = '', children, ...rest }) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
