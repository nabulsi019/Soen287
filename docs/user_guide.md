# User Guide — Deliverable 1 (Frontend)

---

## Student Workflow

### 1. Register
- Click **Register** in the navigation bar.
- Fill in your first name, last name, email, and a password of at least 8 characters.
- Confirm your password. If they don't match, an error message appears inline.
- On success, you are redirected to the Login page.

### 2. Log In
- Enter your email and password on the **Login** page.
- On success, the app redirects you to the **Student Dashboard**.

### 3. Student Dashboard
- The dashboard shows:
  - Your currently enrolled courses.
  - Upcoming assessments with **Pending** status, sorted by due date.
  - A completion progress bar for each course (% of assessments marked completed).
- Click **Browse Courses** to find and enroll in courses.

### 4. Enroll in a Course
- Click **Browse Courses** from the dashboard.
- Available courses from the admin catalog are listed.
- Click **Enroll** next to a course. A prompt appears asking for the instructor's name — fill it in and confirm.
- The course is added to your dashboard immediately.

### 5. View Course Details
- Click on any enrolled course to open its **Course Details** page.
- The page shows a table of all assessments for that course: title, category, weight (%), due date, and status.

### 6. Add an Assessment
- From the Course Details page, click **Add Assessment**.
- Fill in the title, category (Assignment, Lab, Quiz, Midterm, Final Exam, or Project), due date, and weight (%).
- Click **Save Assessment**. The assessment appears in the course table with a **Pending** status.

### 7. Toggle Assessment Status
- In the Course Details table, click the status button next to an assessment to toggle it between **Pending** and **Completed**.
- The dashboard progress bar updates to reflect the change.

### 8. Delete an Assessment
- In the Course Details table, click **Delete** next to an assessment to remove it permanently.

### 9. Log Out
- Click **Logout** in the navigation to end your session and return to the home page.

---

## Admin Workflow

> **Note:** Admin accounts are not created through the Register page. See the [Installation Guide](installation_guide.md) for how to create an admin account.

### 1. Log In as Admin
- Go to the **Login** page and enter your admin email and password.
- The app redirects you to the **Admin Dashboard**.

### 2. Admin Dashboard
- The dashboard provides links to three sections:
  - **Create Course** — Add a new course to the catalog.
  - **Manage Courses** — Enable, disable, or delete existing courses.
  - **Analytics** — View student enrollment stats.

### 3. Create a Course
- Go to **Create Course** from the Admin Dashboard.
- Fill in: course code, title, number of credits, term, and a short description.
- Click **Save Course**. The course is added to the catalog and becomes visible to students.

### 4. Manage Courses
- Go to **Manage Courses** to see all catalog courses in a table.
- **Enable/Disable:** Use the checkbox to control whether students can enroll in a course. Disabled courses are hidden from students.
- **Delete:** Click **Delete** to permanently remove a course from the catalog.

### 5. Analytics
- Go to **Analytics** to view:
  - **Total Students:** The number of registered student accounts.
  - **Enrollment per Course:** A bar for each course showing how many students enrolled.
