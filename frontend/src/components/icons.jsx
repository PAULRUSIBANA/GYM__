const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

export const LogoMark = (props) => (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
    <g fill="var(--cherry-500)">
      <rect x="1.5" y="12.5" width="3" height="7" rx="1" />
      <rect x="5.5" y="9" width="4" height="14" rx="1.5" />
      <rect x="9.5" y="14.5" width="13" height="3" rx="1" />
      <rect x="22.5" y="9" width="4" height="14" rx="1.5" />
      <rect x="27.5" y="12.5" width="3" height="7" rx="1" />
    </g>
  </svg>
)

export const MenuIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
)

export const PlusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const ArrowRight = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (props) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)
