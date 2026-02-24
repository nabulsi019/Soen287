# Installation Guide (Deliverable 1 Frontend)

## 1. Prerequisites
- Desktop browser (Chrome, Edge, Firefox, or Safari).
- Recommended: Visual Studio Code with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for auto-reload.

## 2. Get the Source
1. Download or clone the repository to your machine.
2. Ensure the project lives inside a path **without spaces** if possible to avoid shell quoting issues.

## 3. Run the Frontend
### Option A – VS Code + Live Server
1. Open the repo folder (`soen287/`) in VS Code.
2. Right-click `client/index.html` in the Explorer and choose **Open with Live Server**.
3. Your default browser opens `http://127.0.0.1:5500/.../client/index.html`. Keep Live Server running while you work.

### Option B – Static File (no tooling)
1. Open your browser.
2. Drag-and-drop `client/index.html` into the browser window or use **File → Open**.
3. Ensure relative links load via the `file://` protocol (navigation works because all pages are plain HTML).

## 4. Logging In / Seeding Data
- Use the **Seed Demo Data** button on the landing page to reset the mock users, courses, assessments, and templates (admin: `admin@smartcoursecompanion.ca / Admin#1234`, student: `student@smartcoursecompanion.ca / Student#1234`).
- The button clears any changes you made in `localStorage` and reloads the page with fresh demo data.

## 5. Resetting Local Storage Manually
1. Open the browser dev tools (F12) → **Application** (Chrome) or **Storage** (Firefox).
2. Expand **Local Storage**, select the site origin (or `file://` entry if running locally).
3. Delete keys beginning with:
   - `sccUsers`
   - `sccCurrentUser`
   - `sccCourses`
   - `sccAssessments`
   - `sccTemplates`
4. Refresh the page; the app reseeds defaults if you click **Seed Demo Data** or log in again.

## 6. Troubleshooting
- **Blank data after refresh:** Seed demo data again or ensure you didn’t block third-party cookies/storage.
- **Links don’t work in file mode:** Some browsers block `file://` relative navigation; use VS Code Live Server instead.
- **Validation errors:** Inline helper text under each form highlights what needs fixing (e.g., passwords < 8 chars, template weights not totaling 100%).
