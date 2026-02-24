# User Guide

## Student Workflow
1. **Seed or register**  
   - Click **Seed Demo Data** on the landing page to load sample accounts, or open **Register** to create a new student profile (minimum 8-character password).  
   - After registering, you’re redirected to the student dashboard automatically.
2. **Log in**  
   - Use the **Login** page with your email/password. The navbar updates to show only student pages. Inline feedback confirms success or explains validation issues.
3. **View dashboard**  
   - The **Student Dashboard** lists your courses, upcoming assessments (sorted by due date), and per-course averages/progress bars. Toggle assessment status directly from this page to keep stats current.
4. **Add courses**  
   - Open **Courses** → fill the form. You can either:
     - Enter details manually for a custom course; or
     - Select **Create from Template** to instantly clone an admin-defined template (adds placeholder assessments by category).  
   - Catalog rule reminder: you may only add catalog courses that are enabled, otherwise pick a new code for a custom entry. Inline feedback highlights any issues.
5. **Manage assessments**  
   - From **Courses** or **Course Details**, use the **Assessment Submission** form to add new assessments (course dropdown is prefilled when launched from a course).  
   - Edit/delete assessments and monitor average progress directly on Course Details; the inline form enforces valid weights and shows feedback after each action.
6. **Mark completion**  
   - On the dashboard or Course Details table, use the toggle button to switch an assessment between **Pending** and **Completed**.  
   - Completion percentages and averages update immediately across the dashboard and admin analytics.

## Admin Workflow
1. **Seed or log in as admin**  
   - Seed Demo Data for the default admin (`admin@smartcoursecompanion.ca / Admin#1234`), or use your own admin credentials on the **Login** page.
2. **Manage catalog courses** (`Admin → Courses`)  
   - Create or edit global catalog courses with code/name/instructor/term/description.  
   - Toggle **Enabled** to control whether students can add that catalog course. Disabled courses remain hidden unless the student invents a custom code.
3. **Create templates** (`Admin → Templates`)  
   - Define course code/name, description, and a list of assessment components with weights that sum to 100%.  
   - Save templates, edit them later, or delete ones you no longer need. Students can instantiate these templates from their course form.
4. **View anonymized stats** (`Admin → Stats`)  
   - The analytics page shows total student count, overall assessment completion rate, and per-course completion bars.  
   - No personal data is displayed—only aggregated numbers by course code/name.
5. **General notes**  
   - Admin-only pages are hidden from students via the navbar and enforced by role checks; attempts to load them without admin credentials redirect to login.  
   - Use the Seed Demo Data button before demos to reset catalog entries, templates, users, and assessments to a clean baseline.
