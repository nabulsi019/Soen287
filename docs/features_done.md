# Features Completed — Deliverable 1 (Frontend)

All features below are implemented as a pure HTML/CSS/JavaScript frontend using `localStorage` for data persistence.

---

## Authentication
- **Register:** Students create an account with first name, last name, email, and password (min 8 chars). Duplicate email detection and password match validation included.
- **Login:** Users log in with email and password. The app reads the stored `role` field and redirects students to the Student Dashboard and admins to the Admin Dashboard.
- **Role-based navigation:** Nav links are filtered by role — students and admins only see the pages relevant to them.

---

## Student Features

- **Student Dashboard:** Shows a summary of enrolled courses, upcoming pending assessments sorted by due date, and a completion progress bar per course.
- **Browse & Enroll in Courses:** Students browse admin-created courses from the catalog. Enrolling opens a modal to enter the instructor's name. Enrolled courses are saved to the student's course list.
- **Course Details:** Each enrolled course has a details page showing all its assessments in a table (title, category, weight, due date, status).
- **Add Assessment:** Students add assessments to a course with a title, category (Assignment, Lab, Quiz, Midterm, Final Exam, Project), due date, and weight (%).
- **Toggle Assessment Status:** Each assessment can be toggled between **Pending** and **Completed** directly from the course details table.
- **Delete Assessment:** Students can delete any assessment from the course details page.

---

## Admin Features

- **Create Course:** Admins create catalog courses with a course code, title, credits, term, and description. Created courses are saved to `adminCourses` in localStorage.
- **Manage Courses:** Admins can enable or disable any catalog course (disabled courses are hidden from students) and delete courses entirely.
- **Analytics:** The analytics page shows the total number of registered students and a per-course enrollment bar chart showing how many students enrolled in each course.

---

## UI & Design
- Consistent responsive layout across all pages using a shared CSS file.
- Mobile-friendly hamburger navigation that collapses on small screens.
- Card-based design with progress bars, status badges (pending/completed), and inline form feedback.
- No external JS libraries or frameworks — vanilla HTML, CSS, and JavaScript only.
