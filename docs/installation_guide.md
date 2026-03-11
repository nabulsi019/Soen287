# Installation Guide — Deliverable 1 (Frontend)

> This deliverable implements the frontend only using HTML, CSS, and JavaScript with mock data stored in `localStorage`. No backend, no server, and no database are required to run this version.

---

## Open the App (No Installation Required)

Click the link below to open the app directly in your browser:

**[Open App — client/index.html](../client/index.html)**

If the link does not open automatically, navigate to the `client/` folder and double-click `index.html` — it opens in your default browser via `file://` with no setup needed.

---

## Creating Test Accounts

### Student Account
1. Click **Register** in the navbar.
2. Fill in your name, email, and a password (minimum 8 characters).
3. On success you are redirected to the Login page. Log in to reach the Student Dashboard.

### Admin Account
Registration always creates a student. To create an admin account, open the browser console (F12 → Console) on any page and paste:

```javascript
var users = JSON.parse(localStorage.getItem('scc_users') || '[]');
users.push({
  id: Date.now(),
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@scc.ca',
  password: 'Admin1234',
  role: 'admin'
});
localStorage.setItem('scc_users', JSON.stringify(users));
```

Then log in with `admin@scc.ca` / `Admin1234` to reach the Admin Dashboard.

---

## Resetting Data

All data lives in `localStorage`. To wipe everything and start fresh:

1. Open browser dev tools (F12) → **Application** tab (Chrome) or **Storage** tab (Firefox).
2. Select **Local Storage** → click **Clear All**, or delete these keys individually:
   - `scc_users`
   - `scc_currentUser`
   - `scc_myCourses`
   - `scc_assessments`
   - `adminCourses`
3. Refresh the page.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Clicking the link shows a download prompt | Right-click → Open With → your browser |
| Navigation between pages does not work | Some browsers block `file://` navigation; try a different browser or use VS Code Live Server |
| Admin dashboard not accessible | Create the admin account using the console snippet above |
| Data missing after refresh | Make sure your browser allows `localStorage` for `file://` pages |
