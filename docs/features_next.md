# Features Upcoming

- **Node.js backend + API:** Build Express (or similar) server to handle authentication, courses, assessments, templates, and analytics with proper routing, validation, and error handling.
- **Persistent datastore:** Replace localStorage with a real database (e.g., MongoDB/Postgres) so all user/course/assessment data persists and scales beyond the frontend mock state.
- **Server-side calculations:** Move averages, completion rates, and other metrics into backend services to ensure accuracy, prevent tampering, and enable sharing across clients.
- **Real authentication + authorization:** Implement secure user registration/login with hashed passwords, sessions/JWTs, and role-based middleware so student/admin access is enforced server-side.
- **No hard-coded data:** Seed initial demo content via backend scripts and expose endpoints for CRUD; frontend will consume dynamic data exclusively over API calls.
- **Form/file validation + error reporting:** Centralized middleware will validate inputs (weights, ownership, enabled status) and return structured responses the frontend can surface.
- **Deployment readiness:** Add environment configuration, scripts, and deployment guidelines (e.g., Render/Heroku) for the full stack, plus update docs/install guides accordingly.
