# Backend endpoints (read from the Spring Boot controllers)

Base URL: `http://localhost:8086/api` (`server.port=8086`). All ids are UUIDs.
Create / update / delete return a **plain-text** message, not JSON. Errors are plain text too
(404, 409, 400) or Spring's default JSON error body (500).

## members — `/api/members`
| Method | Path | Body / params | Response |
|---|---|---|---|
| POST | `/save` | `{memberNumber, firstName, lastName, email, phone}` | 201 text |
| GET | `/all` | | `Member[]` |
| GET | `/{id}` | | `Member` or 404 text |
| PUT | `/update/{id}` | `{firstName, lastName, email, phone}` (memberNumber ignored) | text / 404 |
| DELETE | `/delete/{id}` | | text / 404 |
| GET | `/by-last-name?lastName=` | | `Member[]` |
| GET | `/of-trainer/{trainerId}` | | `Member[]` / 404 |

`Member = {id, memberNumber, firstName, lastName, email, phone}`

## trainers — `/api/trainers`
| Method | Path | Body / params | Response |
|---|---|---|---|
| POST | `/save` | `{firstName, lastName, email, studio:{id}?, disciplines:[{id}]?}` | 201 text |
| GET | `/all` | | `Trainer[]` |
| GET | `/{id}` | | `Trainer` / 404 |
| PUT | `/update/{id}` | `{firstName, lastName, email}` (studio, disciplines ignored) | text / 404 |
| DELETE | `/delete/{id}` | | text / 404 |
| GET | `/by-discipline?name=` | | `Trainer[]` |
| PUT | `/{trainerId}/disciplines` | `[uuid]` (adds only) | text / 404 / 409 if already present |
| PATCH | `/{trainerId}/studio?studioNumber=` | | text / 404 / 409 if studio taken |

`Trainer = {id, firstName, lastName, email, studio: Studio|null, disciplines: Discipline[]}`

## studios — `/api/studios`
| Method | Path | Body / params | Response |
|---|---|---|---|
| POST | `/save` | `{name, studioNumber}` | 201 text |
| GET | `/all` | | `Studio[]` |
| GET | `/{id}` | | `Studio` / 404 |
| PUT | `/update/{id}` | `{name, studioNumber}` (0 ignored) | text / 404 |
| DELETE | `/delete/{id}` | | text / 404 |
| GET | `/free` | | `Studio[]` not assigned to a trainer |

`Studio = {id, name, studioNumber}`

## disciplines — `/api/disciplines`
| Method | Path | Body / params | Response |
|---|---|---|---|
| POST | `/save` | `{name}` | 201 text |
| GET | `/all` | | `Discipline[]` |
| GET | `/{id}` | | `Discipline` / 404 |
| PUT | `/update/{id}` | `{name}` | text / 404 |
| DELETE | `/delete/{id}` | | text / 404 |
| GET | `/unused` | | `Discipline[]` with no trainers |

`Discipline = {id, name}`

## training-sessions — `/api/training-sessions`
| Method | Path | Body / params | Response |
|---|---|---|---|
| POST | `/save` | `{sessionDate, goal, member:{id}, trainer:{id}}`; status forced to BOOKED | 201 text / 400 past date / 409 trainer already booked |
| GET | `/all` | | `TrainingSession[]` |
| GET | `/{id}` | | `TrainingSession` / 404 |
| PUT | `/update/{id}` | `{sessionDate, goal}` only | text / 404 |
| DELETE | `/delete/{id}` | | text / 404 / 409 if it has workout logs |
| GET | `/by-status?status=` | BOOKED, CHECKED_IN, FINISHED, CANCELLED | `TrainingSession[]` |
| GET | `/between?start=&end=` | `YYYY-MM-DD` | `TrainingSession[]` |
| PATCH | `/{id}/status?status=` | BOOKED→CHECKED_IN/CANCELLED, CHECKED_IN→FINISHED/CANCELLED | text / 400 / 404 |
| GET | `/stats/by-status` | | `[[status, count]]` |
| PATCH | `/cancel-day?trainerId=&date=` | | text |

`TrainingSession = {id, sessionDate, status, goal, member: Member, trainer: Trainer}`

## workout-logs — `/api/workout-logs`
| Method | Path | Body / params | Response |
|---|---|---|---|
| POST | `/save?trainingSessionId=` | `{exerciseName, repetitions, notes}`; session must be FINISHED; `loggedDate` set by server | 201 text / 400 / 404 |
| GET | `/member/{memberNumber}` | | `WorkoutLog[]` |
| DELETE | `/delete/{id}` | | text / 404 |

There is **no** list-all, get-by-id or update endpoint. The frontend lists logs by calling
`/members/all` and then `/workout-logs/member/{memberNumber}` for each member, and finds a single log in that list.

`WorkoutLog = {id, exerciseName, notes, repetitions, loggedDate, trainingSession: TrainingSession}`
