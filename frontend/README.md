# Ironvale Athletics: Gym Management Frontend

A dark, cinematic React frontend for the Spring Boot gym management API (members, trainers, studios, disciplines, training sessions and workout logs). "Ironvale Athletics" is a placeholder name.

> Screenshot: _add a screenshot of the home page here_ (`docs/home.png`)

## Tech stack

- React 19 and Vite
- React Router 7
- Plain CSS (no frameworks, no UI libraries, no chart libraries)
- Backend (unchanged): Spring Boot REST API with PostgreSQL

## Local setup

1. Make sure PostgreSQL is running with the `gym` database (see `gym-membership-system/src/main/resources/application.properties`).
2. Start the API from `gym-membership-system/`:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   It listens on `http://localhost:8086`.
3. Start the frontend from `frontend/`:
   ```powershell
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`. The port is fixed (`strictPort`) because the backend CORS config allows it.

Other scripts: `npm run build` (production build into `dist/`), `npm run lint`.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8086/api` | Base URL of the Spring Boot API |

Copy `.env.example` to `.env` to override it.

## Design decisions

**Colour system.** All colours are CSS custom properties in `:root` (`src/index.css`): jet-black page, five smoke greys, and cherry red as the only accent (primary buttons, active nav, focus rings, the hero glow line, key numbers). Borders are `1px solid rgba(232,232,236,0.08)`. No pure white or black is used. `--success` appears only on success toasts and `--danger` only on errors and the delete action.

**Typography.** Inter Tight (300 for the hero, 500 for titles and numbers), Inter for body text and labels, Instrument Serif italic for the single accent word "results." Loaded from Google Fonts with `display=swap` and system fallbacks.

**Hero treatment.** Full-bleed gym photo on the right with a 96%-black gradient fading out at 60% of the width, a top/bottom vignette, three blurred fog layers drifting on a 60s loop, and a thin glowing cherry line (2px, `box-shadow` glow) cut diagonally across the photo, all decorative (`aria-hidden`). Under 1024px the photo sits behind the text at lower opacity.

**Motion.** Hero content rises on load (20px, 800ms). Cards and panels rise in on scroll with `IntersectionObserver` (24px, 600ms). Buttons transition in 200ms; the primary button carries a soft cherry glow. `prefers-reduced-motion` disables animation, transitions, fog and the skeleton shimmer.

**Accessibility.** Semantic landmarks, skip link, 2px cherry focus outline with 3px offset on every interactive element, focus trap and Escape handling in the mobile menu and delete dialog, focus returned to the trigger on close, labelled form fields with `aria-invalid` and `aria-describedby`.

## Decisions I made

Every decision below was made without asking. The reasoning for each is in `PLAN_REVIEW.md`.

1. **API base URL is `http://localhost:8086/api`**, not 8080. That is the port in `application.properties`.
2. **Routes use the real controller paths**: `/members`, `/trainers`, `/studios`, `/disciplines`, `/training-sessions`, `/workout-logs`. The prompt's `/classes` example does not exist in the backend.
3. **The API layer is mapped per controller.** The backend uses `/all`, `/save`, `/update/{id}` and `/delete/{id}`, so `src/api/resources.js` hides that behind `list/get/create/update/remove`.
4. **Plain-text responses.** `client.js` parses JSON only when the body is JSON, and shows the backend's text as the error message. A 5xx without a useful body shows a hint about duplicates and linked records.
5. **Backend change: the existing `CorsConfig` was edited** (not duplicated) to also allow `http://localhost:5173` and `http://127.0.0.1:5173`. `http://localhost:3000` is kept so the old CRA frontend still works. No other backend file was touched.
6. **Workout logs have no list, get or update endpoint.** The list is built from `GET /members/all` plus `GET /workout-logs/member/{memberNumber}` for each member. Detail is found in that list. There is **no edit screen** for workout logs: `/workout-logs/:id/edit` redirects to the detail page and the Edit button is hidden. Create picks a FINISHED session and sends it as `?trainingSessionId=`.
7. **Edit forms respect what the backend actually updates.** Member number, and a session's member and trainer, are read-only on edit. A trainer's studio is changed through `PATCH /trainers/{id}/studio`, and disciplines are added through `PUT /trainers/{id}/disciplines`. Existing disciplines cannot be removed (the API only adds). A session's status is changed through `PATCH /status` and only legal next states are offered.
8. **Illegal status change.** The controller returns HTTP 200 with an error sentence for an illegal transition (its check looks for "Cannot change", the service says "cannot change"). The client treats a reply without "successfully" as an error.
9. **Live preview uses training sessions** (newest three by date) because only sessions have a status for the pill.
10. **Hero stats** are the live counts of members, trainers and studios. A failed request shows a dash.
11. **Second hero button reads "Explore sessions"** (there is no classes resource) and links to `/training-sessions`.
12. **Red glow line.** The gym photo has no roof to trace, so the line cuts diagonally through the photo, echoing the reference.
13. **Contrast.** `--smoke-500` was lightened from `#6B6B73` to `#8B8B94` so small captions pass AA. Cherry is used for fills, borders, glows, large text and big numbers, not for small body text. Active nav uses light text with a cherry underline.
14. **Mobile menu breakpoint is 1000px, not 900px**, because six nav links plus the pill button do not fit between 900 and 1000.
15. **Create/update/delete respond with plain text and no id**, so after a successful create the app returns to the list, and after an edit it returns to the detail page.
16. **Delete failures** (for example a member that still has sessions) are shown as a toast with the server's message.
17. **Name, year and copy** are placeholders in `src/data/content.js` (see below). Resource field definitions, columns and labels also live there.
18. **New app lives in `gym_/frontend`.** The old Create React App in `gym_/gym-frontend` was left untouched.
19. **Added** a small `useFocusTrap` hook (shared by the mobile menu and dialogs), a `NotFound` page, a skip link, ESLint (`npm run lint`), and `.gitignore`.
20. **Dev-server port.** Port 5173 was held by another project's preview server on this machine while testing, so I verified the UI on a different port through a temporary proxy. That proxy and its `.env.local` were removed afterwards.
21. The hover colour `--cherry-400` behind light button text is about 3.9:1, slightly under AA for normal text. Kept as specified for hover only.

### Things in the backend you may want to fix (not changed)

- `members.member_number` is unique, but a duplicate returns a 500 instead of a 409.
- Studio numbers are not unique in the database, and `PATCH /trainers/{id}/studio` looks a studio up by number. If two studios share a number (your database currently has two "1"s), that call returns a 500.
- Illegal session status changes return 200 (see decision 8).
- There is no validation (`@Valid`), so the frontend validates required fields, email format, numbers and dates itself.

## Placeholder content

Replace before launch (all in `src/data/content.js` unless noted):

- Business name "Ironvale Athletics" (also in `index.html` title and description)
- Established year (2012)
- Hero headline lines, subtitle and button labels
- Feature strip text, call-to-action text
- Footer address, phone, email, opening hours, privacy and terms links (`#`)
- The hero photo `public/images/gym-hero.jpg` (a copy of the supplied gym photo; confirm you have the right to use it)
- Favicon `public/favicon.svg`
- Hero stats are real API counts, so nothing to replace there
