# Installation Guide — Deliverable 2

This version requires the Express backend to be running. The frontend is served by the backend from the `client` folder.

## 1. Install Node.js

- Install a recent version of Node.js if it is not already installed.

## 2. Install Server Dependencies

From the project root, open a terminal and go to the `server` folder:

```bash
cd server
npm install
```

This installs:

- `express`
- `express-session`
- `bcryptjs`
- `cors`

## 3. Start the Server

From the `server` folder, run:

```bash
npm start
```

The app runs on:

```text
http://localhost:3000
```

## 4. Open the App

Open this URL in your browser:

```text
http://localhost:3000
```

Do not open the HTML files directly with `file://`. Deliverable 2 needs the backend session and API routes.

## 5. Database File

- The app stores all data in `server/db.json`.
- This file is the only database for Deliverable 2.
- It stores users, admin-created courses, admin assessment templates, student enrollments, and student assessments.

## 6. Default Admin Account

When the server starts, it automatically creates a default admin account if one does not already exist.

- Email: `admin@scc.ca`
- Password: `Admin1234`

## 7. Important Note

- The backend must stay running while you use the app.
- If the server is stopped, login, course management, enrollments, and assessment actions will not work.

## 8. Resetting Data

To reset the app data, stop the server and replace the contents of `server/db.json` with:

```json
{
  "users": [],
  "adminCourses": [],
  "adminCourseAssessments": [],
  "enrollments": [],
  "assessments": []
}
```

When you restart the server, the default admin account will be seeded again automatically.
