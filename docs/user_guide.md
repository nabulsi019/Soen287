# User Guide — Deliverable 2

## Student Workflow

### 1. Register

- Open the Register page.
- Enter first name, last name, email, password, and confirm password.
- Submit the form to create a student account.

### 2. Log In

- Open the Login page.
- Enter your email and password.
- Students are redirected to the Student Dashboard after a successful login.

### 3. View the Student Dashboard

- The dashboard shows your enrolled courses.
- It also shows upcoming pending assessments sorted by due date.
- The progress section shows your current course averages and assessment completion counts.

### 4. Browse and Enroll in Courses

- Open the Courses page.
- Select a term and search by course code or title.
- Click Enroll on an enabled course.
- Enter the instructor name in the modal and confirm.
- The course is added to your enrolled courses list.

### 5. Open Course Details

- From the Courses page or Dashboard, open a course.
- The Course Details page shows the course summary and its assessments.
- The average banner shows the current average for that enrolled course.

### 6. Add an Assessment

- On the Course Details page, click Add Assessment.
- Enter the title, category, due date, weight, and total marks.
- Save the assessment to return to the course details page.

### 7. Update Assessment Marks and Status

- On the Course Details page, enter earned marks and total marks directly in the table.
- The page recalculates the current average using the server response.
- You can also toggle an assessment between Pending and Completed.

### 8. Delete an Assessment

- On the Course Details page, click Delete for the assessment you want to remove.

### 9. Log Out

- Click Logout in the navigation bar.
- The app logs you out through the backend session and returns you to the home page.

## Admin Workflow

### 1. Log In as Admin

- Open the Login page.
- Sign in with the admin account.
- Admins are redirected to the Admin Dashboard.

### 2. Create a Course

- Open Create Course from the Admin Dashboard.
- Enter course code, title, credits, term, and description.
- Save the course.

### 3. Manage Courses

- Open Manage Courses from the Admin Dashboard.
- View all admin-created courses in the course table.
- Click Edit to update course information and assessment templates.
- Use the Enabled checkbox to show or hide a course from students.
- Click Delete to remove a course.

### 4. Edit Assessment Templates

- In the Edit Course modal, add, update, or remove assessment components.
- These templates are copied to a student’s course when the student enrolls.

### 5. View Admin Stats

- Open Analytics from the Admin Dashboard.
- View the total number of student accounts.
- View per-course enrollment counts.
- The stats are anonymized and do not expose individual student details.
