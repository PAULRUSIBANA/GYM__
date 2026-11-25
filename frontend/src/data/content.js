// All visible text and configuration lives here. Replace placeholders before launch.

export const site = {
  name: 'Ironvale Athletics',
  shortName: 'Ironvale',
  established: 2012,
  addLabel: 'Add member',
  addTo: '/members/new',
}

export const nav = {
  skip: 'Skip to content',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  primaryLabel: 'Primary',
  mobileLabel: 'Mobile menu',
}

export const hero = {
  badge: `Est. ${site.established}`,
  lines: ['Train harder.', 'Recover smarter.'],
  accentPrefix: 'Built for',
  accent: 'results.',
  subtitle:
    'One place to run your members, trainers, studios and training sessions, built for the way a serious gym actually works.',
  primary: { label: 'Join now', to: '/members/new' },
  secondary: { label: 'Explore sessions', to: '/training-sessions' },
  stats: [
    { resource: 'members', label: 'Members' },
    { resource: 'trainers', label: 'Trainers' },
    { resource: 'studios', label: 'Studios' },
  ],
  statsLabel: 'Gym at a glance',
  missing: '—',
}

export const features = {
  eyebrow: 'What you can do',
  title: 'Everything the floor needs.',
  items: [
    {
      title: 'Book with confidence',
      text: 'Match a member with a trainer, pick the date and move the session from booked to finished. Double bookings are caught for you.',
    },
    {
      title: 'Track every rep',
      text: 'Log exercises, reps and notes against finished sessions, then look up a member’s full history in seconds.',
    },
    {
      title: 'Run the whole gym',
      text: 'Keep studios, disciplines and trainer assignments in one tidy roster that your whole team can trust.',
    },
  ],
}

export const preview = {
  eyebrow: 'Live from the API',
  title: 'Latest training sessions',
  viewAll: 'View all sessions',
  empty: 'No sessions booked yet.',
  emptyAction: 'Book the first session',
  error: 'We could not load sessions.',
  retry: 'Try again',
  count: 3,
}

export const cta = {
  title: 'Ready when you are.',
  text: 'Add your first member and book a session in under a minute.',
  button: { label: 'Add a member', to: '/members/new' },
}

export const footer = {
  about: 'Premium strength training, coaching and recovery, run by people who lift.',
  navTitle: 'Explore',
  contactTitle: 'Contact',
  hoursTitle: 'Hours',
  contact: ['KG 699 St', 'Kigali, Rwanda', '+250 781 002 389', 'paulrusibana@gmail.com'],
  hours: [
    { day: 'Mon – Fri', time: '05:30 – 22:00' },
    { day: 'Saturday', time: '07:00 – 20:00' },
    { day: 'Sunday', time: '08:00 – 18:00' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

export const ui = {
  add: 'Add new',
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving…',
  back: 'Back to list',
  search: 'Search',
  searchHint: 'Filter this list',
  noMatches: 'No records match your search.',
  emptyTitle: 'No records yet',
  emptyAction: 'Add the first one',
  errorTitle: 'Something went wrong',
  retry: 'Try again',
  loading: 'Loading',
  actions: 'Actions',
  none: '—',
  notFoundTitle: 'Page not found',
  notFoundText: 'That page does not exist.',
  home: 'Back to home',
  toastClose: 'Dismiss notification',
  deleteTitle: 'Delete this record?',
  deleteText: (label) => `“${label}” will be permanently removed. This cannot be undone.`,
  deleting: 'Deleting…',
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  min: (n) => `Enter a number of ${n} or more.`,
  pastDate: 'Choose today or a future date.',
  chooseOne: 'Choose…',
  noRelation: (plural) => `No ${plural.toLowerCase()} yet. Add one first.`,
  lockedHint: 'Cannot be changed after creation.',
  addOnlyHint: 'Existing choices cannot be removed; the API only adds.',
  formError: 'Please fix the highlighted fields.',
  saved: (singular) => `${singular} saved.`,
  deleted: (singular) => `${singular} deleted.`,
}

export const errors = {
  timeout: 'The server took longer than 10 seconds to respond.',
  network: (url) => `Cannot reach the API at ${url}. Is the Spring Boot server running?`,
  generic: (status) => `The request failed (HTTP ${status}).`,
  server:
    'The server could not complete this request. Usual causes: a duplicate value (such as a member number or studio number) or a record that other records still use.',
  notFound: 'That record could not be found.',
}

export const statusLabels = {
  BOOKED: 'Booked',
  CHECKED_IN: 'Checked in',
  FINISHED: 'Finished',
  CANCELLED: 'Cancelled',
}

const statusFlow = {
  // Booked -> Finished is allowed here; the API layer checks the session in first.
  BOOKED: ['BOOKED', 'CHECKED_IN', 'FINISHED', 'CANCELLED'],
  CHECKED_IN: ['CHECKED_IN', 'FINISHED', 'CANCELLED'],
  FINISHED: ['FINISHED'],
  CANCELLED: ['CANCELLED'],
}

const statusOptions = (record) =>
  (statusFlow[record?.status] ?? ['BOOKED']).map((value) => ({ value, label: statusLabels[value] }))

const fullName = (r) => [r?.firstName, r?.lastName].filter(Boolean).join(' ')
const dash = ui.none

// Resource definitions. Keys are the backend controller paths under /api.
export const resources = {
  members: {
    nav: 'Members',
    singular: 'Member',
    plural: 'Members',
    eyebrow: 'Roster',
    intro: 'Everyone who trains with you.',
    title: (r) => `${fullName(r)} (${r.memberNumber})`,
    columns: [
      { label: 'Number', get: (r) => r.memberNumber },
      { label: 'Name', get: fullName, primary: true },
      { label: 'Email', get: (r) => r.email },
      { label: 'Phone', get: (r) => r.phone },
    ],
    fields: [
      { name: 'memberNumber', label: 'Member number', type: 'text', required: true, lockedOnEdit: true },
      { name: 'firstName', label: 'First name', type: 'text', required: true },
      { name: 'lastName', label: 'Last name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
    ],
  },
  trainers: {
    nav: 'Trainers',
    singular: 'Trainer',
    plural: 'Trainers',
    eyebrow: 'Coaches',
    intro: 'The people who run your sessions.',
    title: fullName,
    columns: [
      { label: 'Name', get: fullName, primary: true },
      { label: 'Email', get: (r) => r.email },
      { label: 'Studio', get: (r) => (r.studio ? `${r.studio.name} (#${r.studio.studioNumber})` : dash) },
      {
        label: 'Disciplines',
        get: (r) => (r.disciplines?.length ? r.disciplines.map((d) => d.name).join(', ') : dash),
      },
    ],
    fields: [
      { name: 'firstName', label: 'First name', type: 'text', required: true },
      { name: 'lastName', label: 'Last name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'studio', label: 'Studio', type: 'relation', relation: 'studios' },
      { name: 'disciplines', label: 'Disciplines', type: 'relation-multi', relation: 'disciplines', addOnlyOnEdit: true },
    ],
  },
  studios: {
    nav: 'Studios',
    singular: 'Studio',
    plural: 'Studios',
    eyebrow: 'Spaces',
    intro: 'Rooms and floors, each with its own number.',
    title: (r) => `${r.name} (#${r.studioNumber})`,
    columns: [
      { label: 'Number', get: (r) => r.studioNumber },
      { label: 'Name', get: (r) => r.name, primary: true },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'studioNumber', label: 'Studio number', type: 'number', required: true, min: 1 },
    ],
  },
  disciplines: {
    nav: 'Disciplines',
    singular: 'Discipline',
    plural: 'Disciplines',
    eyebrow: 'Skills',
    intro: 'The training styles your trainers teach.',
    title: (r) => r.name,
    columns: [{ label: 'Name', get: (r) => r.name, primary: true }],
    fields: [{ name: 'name', label: 'Name', type: 'text', required: true }],
  },
  'training-sessions': {
    nav: 'Sessions',
    singular: 'Training session',
    plural: 'Training sessions',
    eyebrow: 'Schedule',
    intro: 'Bookings between members and trainers.',
    title: (r) => `${r.sessionDate} · ${fullName(r.member)}`,
    columns: [
      { label: 'Date', get: (r) => r.sessionDate, primary: true },
      { label: 'Status', get: (r) => r.status, pill: true },
      { label: 'Member', get: (r) => fullName(r.member) || dash },
      { label: 'Trainer', get: (r) => fullName(r.trainer) || dash },
      { label: 'Goal', get: (r) => r.goal },
    ],
    fields: [
      { name: 'member', label: 'Member', type: 'relation', relation: 'members', required: true, lockedOnEdit: true },
      { name: 'trainer', label: 'Trainer', type: 'relation', relation: 'trainers', required: true, lockedOnEdit: true },
      { name: 'sessionDate', label: 'Date', type: 'date', required: true, noPastOnCreate: true },
      { name: 'goal', label: 'Goal', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', editOnly: true, options: statusOptions },
    ],
  },
  'workout-logs': {
    nav: 'Workout logs',
    singular: 'Workout log',
    plural: 'Workout logs',
    eyebrow: 'Progress',
    intro: 'Exercises recorded against finished sessions.',
    canEdit: false,
    title: (r) => `${r.exerciseName} · ${r.loggedDate}`,
    columns: [
      { label: 'Exercise', get: (r) => r.exerciseName, primary: true },
      { label: 'Reps', get: (r) => r.repetitions },
      { label: 'Logged', get: (r) => r.loggedDate },
      { label: 'Member', get: (r) => fullName(r.trainingSession?.member) || dash },
      { label: 'Session date', get: (r) => r.trainingSession?.sessionDate ?? dash },
      { label: 'Notes', get: (r) => r.notes, detailOnly: true },
    ],
    fields: [
      {
        name: 'trainingSessionId',
        label: 'Finished session',
        type: 'relation',
        relation: 'training-sessions',
        filter: (r) => r.status === 'FINISHED',
        required: true,
        asParam: true,
        hint: 'Workout logs can only be added to sessions with the Finished status.',
      },
      { name: 'exerciseName', label: 'Exercise', type: 'text', required: true },
      { name: 'repetitions', label: 'Repetitions', type: 'number', required: true, min: 1 },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
}

export const resourceKeys = Object.keys(resources)
