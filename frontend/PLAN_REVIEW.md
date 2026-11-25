# Plan Review (written before coding)

Source of truth: the Spring Boot project in `../gym-membership-system` (controllers, entities, services) and the two reference images.

## 1. API summary

Base URL: `http://localhost:8086/api` (`server.port=8086` in `application.properties`). Database: PostgreSQL. All ids are **UUIDs**.

The API is *not* conventional REST. Every resource uses `/all`, `/save`, `/update/{id}` and `/delete/{id}`. Create, update and delete return a **plain-text string** (not JSON) such as `"Member saved successfully"`; the created entity or its id is not returned. 404/409/400 bodies are also plain text.

| Resource (path) | list | get | create | update | delete | extra endpoints |
|---|---|---|---|---|---|---|
| `members` | GET `/all` | GET `/{id}` | POST `/save` | PUT `/update/{id}` | DELETE `/delete/{id}` | GET `/by-last-name?lastName=`, GET `/of-trainer/{trainerId}` |
| `trainers` | GET `/all` | GET `/{id}` | POST `/save` | PUT `/update/{id}` | DELETE `/delete/{id}` | GET `/by-discipline?name=`, PUT `/{id}/disciplines` (body: `[uuid]`), PATCH `/{id}/studio?studioNumber=` |
| `studios` | GET `/all` | GET `/{id}` | POST `/save` | PUT `/update/{id}` | DELETE `/delete/{id}` | GET `/free` |
| `disciplines` | GET `/all` | GET `/{id}` | POST `/save` | PUT `/update/{id}` | DELETE `/delete/{id}` | GET `/unused` |
| `training-sessions` | GET `/all` | GET `/{id}` | POST `/save` | PUT `/update/{id}` | DELETE `/delete/{id}` | GET `/by-status?status=`, GET `/between?start=&end=`, PATCH `/{id}/status?status=`, GET `/stats/by-status`, PATCH `/cancel-day?trainerId=&date=` |
| `workout-logs` | **none** (only GET `/member/{memberNumber}`) | **none** | POST `/save?trainingSessionId=` | **none** | DELETE `/delete/{id}` | |

Entity fields:

- **Member**: `id`, `memberNumber` (unique), `firstName`, `lastName`, `email`, `phone`
- **Trainer**: `id`, `firstName`, `lastName`, `email`, `studio` (Studio, many-to-one), `disciplines` (Discipline[], many-to-many)
- **Studio**: `id`, `name`, `studioNumber` (int)
- **Discipline**: `id`, `name` (its `trainers` list is `@JsonIgnore`d)
- **TrainingSession**: `id`, `sessionDate` (`YYYY-MM-DD`), `status` (`BOOKED | CHECKED_IN | FINISHED | CANCELLED`), `goal`, `member` (Member), `trainer` (Trainer)
- **WorkoutLog**: `id`, `exerciseName`, `notes`, `repetitions` (int), `loggedDate` (set by server), `trainingSession`

## 2. Conflicts and problems found

1. **Wrong port.** The prompt says `http://localhost:8080/api`; the backend runs on **8086**.
2. **Resource names.** The prompt's examples (`/classes`) do not exist. Real resources: members, trainers, studios, disciplines, training-sessions, workout-logs.
3. **Non-REST URLs.** `/all`, `/save`, `/update/{id}`, `/delete/{id}` do not match a generic `GET/POST/PUT/DELETE /resource` wrapper.
4. **Plain-text responses.** A client that always calls `response.json()` breaks on every create/update/delete and on every error from these controllers.
5. **CORS already exists but is wrong.** `CorsConfig` already allows only `http://localhost:3000`. The prompt says to *add* a class; adding a second one would create a duplicate bean name/class.
6. **Workout logs break the "five screens per resource" rule.** No list-all, no get-by-id, no update endpoint. Create requires `?trainingSessionId=` and the session must be `FINISHED`; `loggedDate` is set by the server.
7. **Update endpoints ignore most fields.** Member update ignores `memberNumber`; studio update ignores `studioNumber == 0`; trainer update ignores `studio` and `disciplines` (separate endpoints; `PUT /disciplines` only *adds* and returns 409 if the trainer already has one); training-session update only changes `sessionDate` and `goal` (status via PATCH; member/trainer cannot be changed). Create forces status to `BOOKED` and rejects past dates.
8. **No validation on the backend.** No `@Valid`, so missing fields are accepted. Duplicate `memberNumber` and deleting rows still referenced by foreign keys will surface as generic 500s.
9. **"Live data preview ... status pill"** assumes the first resource has a status. Members do not; only training sessions do.
10. **"Join now / Explore classes"** and the "classes" wording: there is no classes resource.
11. **Hero glow line "traces the roof"**: the gym photo has no roof or diagonal structure.
12. **Contrast rules vs. tokens.** `--smoke-500` (#6B6B73) on `--jet-black` is about 3.7:1 and on `--smoke-900` about 3.3:1, below the AA 4.5:1 required for 12px captions. `--cherry-500` / `--cherry-400` on black are about 3.4:1 and 4.1:1, which fail AA for small text.
13. **"Only jet black, smoke grey, cherry red tokens" vs. `--success` and `--danger`** tokens, which the prompt also defines. Not truly conflicting but worth noting. Also "no pure white/black" is fine, but the ceiling lights in the photo are near-white (it is a photo, so exempt).
14. **Existing `gym-frontend/`** (Create React App) already sits beside the backend. The prompt wants a new Vite `frontend/` folder.
15. **Workout-log pages vs "detail by id":** with no get-by-id endpoint, the detail screen must find the record from the aggregated list.

## 3. Corrections I will apply

| # | Correction | Reason |
|---|---|---|
| 1 | Default API URL `http://localhost:8086/api`, overridable with `VITE_API_URL` | Matches `application.properties` |
| 2, 3 | Routes use the real backend slugs (`training-sessions`, `workout-logs`, ...). `resources.js` maps list/get/create/update/remove to each controller's real paths | Prompt demands routes come from the controllers |
| 4 | `client.js` reads the body as text and parses JSON only when it is JSON; error message = text body, or JSON `message`/`error`, plus status code | Backend returns plain text |
| 5 | Edit the existing `CorsConfig` to also allow `http://localhost:5173` and `http://127.0.0.1:5173` (keeping 3000). This is the only backend change | One CORS class, no duplicates |
| 6 | Workout logs: list = fetch members, then `GET /member/{memberNumber}` per member, merged and filterable by member; detail = found from that list; create = form with a "Finished session" select sent as `?trainingSessionId=`; **no edit screen** (route redirects to detail, Edit button hidden); delete works | The API has no list/get/update |
| 7 | Forms mark non-updatable fields read-only on edit. Trainer edit: after `PUT /update`, call `PATCH /studio` if studio changed and `PUT /disciplines` with newly added disciplines only. Training-session edit: date, goal, and status (via `PATCH /status`; only legal transitions offered). Member number read-only on edit | Avoids silently ignored edits |
| 8 | Client-side validation (required, email, number min, future dates) plus readable backend errors; FK-delete failures show a friendly message | Backend gives no validation |
| 9 | Live preview uses **training sessions** (sorted by date, newest first) | Only resource with a status |
| 10 | Hero CTA is "Explore sessions" linking to `/training-sessions` | No classes resource |
| 11 | The red glow line is a skewed 2px line along the left edge of the photo panel, in line with the mirror frames in the photo | There is no roof to trace; this keeps the reference's idea |
| 12 | Lighten `--smoke-500` to `#8B8B94` (about 5.7:1 on black, 5:1 on `--smoke-900`). Cherry is used for fills, borders, glows, large text and big numbers only; small text uses smoke-100 with a cherry underline or dot | Meets the AA requirement without a new colour |
| 14 | Build the new app in `gym_/frontend`, leave `gym-frontend` untouched | Do not damage existing work |

## 4. Unclear or impossible as written

- "Every backend resource has list, detail, create, edit, and delete screens" is **impossible for workout-logs** (see 6). Edit is omitted by design.
- "Est. [YEAR]" and the business name are not given; placeholders in `content.js`.
- "The first resource returned by the API" is ambiguous; resolved in 9.
- "Test against the running Spring Boot API" needs PostgreSQL (it is listening on 5432) and the backend started; I will try to start it. If it cannot start, I will say so and verify against what could be run.
- The hover colour `--cherry-400` behind light text is about 3.9:1, slightly under AA for normal text. Kept as specified for hover only; documented.
