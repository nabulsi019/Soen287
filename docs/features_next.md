# Features Upcoming — Deliverable 2 (Backend)

The following features are planned for the next deliverable. All current frontend functionality will be preserved and connected to a real backend.

---

## Backend & API
- Build a **Node.js + Express** server exposing REST API endpoints for users, courses, assessments, and analytics.
- Replace all `localStorage` reads/writes with `fetch()` API calls to the backend.

## Database
- Introduce a real database firebase to persist all user, course, and assessment data server-side.
- Data will no longer be lost on browser clear or device switch.

## Real Authentication & Authorization
- Implement secure login with **hashed passwords** (bcrypt) and session management or **JWT tokens**.
- Enforce role-based access server-side so admin routes reject unauthorized requests regardless of client-side state.
- Remove reliance on `localStorage` for session tracking.

## Server-Side Business Logic
- Move enrollment rules, assessment weight validation, and analytics calculations from the browser into backend services.
- Prevents client-side tampering and ensures consistent results across all users.

## Admin Account Management
- Allow admins to be created through a backend seeding script or a protected setup route, removing the need for manual `localStorage` injection.

## Deployment
- Add environment configuration (`.env`) and deployment instructions for hosting the full stack on a platform such as Render or Railway.
- Update the installation guide with production URLs and backend setup steps.
