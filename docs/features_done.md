# Features Completed — Deliverable 2

Smart Course Companion now runs as a simple web app with a Node.js + Express backend, session-based authentication, and `db.json` persistence.

## Backend Authentication

- Student registration is handled by `POST /api/auth/register`.
- Login is handled by `POST /api/auth/login`.
- Logout is handled by `POST /api/auth/logout`.
- Session checks are handled by `GET /api/auth/me`.
- Passwords are hashed with `bcryptjs`.
- Authentication uses `express-session`, not JWT.

## Shared Data Persistence

- `server/db.json` is the only database.
- The database structure is:
  - `users`
  - `adminCourses`
  - `adminCourseAssessments`
  - `enrollments`
  - `assessments`
- A default admin account is seeded automatically if no admin exists.

## Student Features Using the Backend

- Students can register and log in through the backend.
- Students can browse enabled courses from the admin course catalog.
- Students can enroll in courses through the backend.
- Enrolling in a course copies admin assessment templates into student-owned assessment records.
- Students can view only their own enrolled courses and their own assessments.
- Students can add, update, and delete their own assessments.
- Student dashboard data comes from backend routes, not browser-only storage.

## Admin Features Using the Backend

- Admins can create courses through the backend.
- Admins can edit courses and assessment templates through the backend.
- Admins can enable or disable courses through the backend.
- Admins can delete courses through the backend.
- Admin stats come from the backend and expose only anonymized totals.

## Server-Side Calculations

- Course averages are calculated on the server.
- Dashboard upcoming assessments are filtered and sorted on the server.
- Admin per-course enrollment counts are calculated on the server.

## Frontend and Backend Integration

- Student pages now use `fetch()` with `credentials: 'include'`.
- Admin pages now use `fetch()` with `credentials: 'include'`.
- The backend session is the real source of truth for login state.
- LocalStorage is kept only for lightweight compatibility such as navigation/session caching.
