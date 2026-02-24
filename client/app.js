const mockData = {
  student: {
    name: 'Jordan Lee',
    courses: [
      { code: 'SOEN 287', title: 'Web Programming', progress: 72 },
      { code: 'COMP 232', title: 'Mathematics for CS', progress: 54 },
      { code: 'SOEN 298', title: 'Professional Practice', progress: 38 }
    ],
    assessments: [
      { title: 'Project Proposal', course: 'SOEN 287', due: '2026-02-20' },
      { title: 'Quiz 2', course: 'COMP 232', due: '2026-02-18' },
      { title: 'Lab 3', course: 'SOEN 287', due: '2026-02-25' }
    ]
  },
  catalog: [
    {
      code: 'SOEN 287',
      title: 'Web Programming',
      summary: 'Client-side development fundamentals.',
      credits: 3,
      term: 'Winter 2026'
    },
    {
      code: 'SOEN 390',
      title: 'Software Engineering Project',
      summary: 'Capstone project with real clients.',
      credits: 4,
      term: 'Winter 2026'
    },
    {
      code: 'COMP 248',
      title: 'Object-Oriented Programming',
      summary: 'Java-based introduction to OOP.',
      credits: 3,
      term: 'Fall 2025'
    }
  ],
  adminCourses: [
    { code: 'SOEN 287', title: 'Web Programming', term: 'Winter 2026', status: 'Published' },
    { code: 'SOEN 390', title: 'Software Engineering Project', term: 'Winter 2026', status: 'Draft' },
    { code: 'COMP 248', title: 'Object-Oriented Programming', term: 'Fall 2025', status: 'Archived' }
  ],
  templates: [
    { name: 'Default Coursework', description: '40% assignments, 20% quizzes, 40% exams' },
    { name: 'Project Heavy', description: '60% project, 20% presentations, 20% exams' }
  ],
  alerts: [
    { level: 'info', message: 'Two instructors requested new course shells.' },
    { level: 'warning', message: 'Assessment weights for COMP 248 exceed 100%.' }
  ]
};

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

function formatPercentValue(value) {
  if (!Number.isFinite(value)) return '--';
  const rounded = Number(value.toFixed(1));
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

function seedDemoData() {
  localStorage.setItem(auth.usersKey, JSON.stringify(seedUsers));
  localStorage.setItem(dataStore.courseKey, JSON.stringify(seedCourses));
  localStorage.setItem(dataStore.assessmentKey, JSON.stringify(seedAssessments));
  localStorage.setItem(dataStore.templateKey, JSON.stringify([]));
  localStorage.removeItem(auth.currentKey);
  window.location.reload();
}

const helpers = {
  select(selector) {
    return document.querySelector(selector);
  },
  renderList(el, items, renderItem, emptyText = 'No records found.') {
    if (!el) return;
    if (!items || !items.length) {
      el.innerHTML = `<li class="muted">${emptyText}</li>`;
      return;
    }
    el.innerHTML = items.map(renderItem).join('');
  },
  handleForm(selector, handler) {
    const form = document.querySelector(selector);
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      handler?.(data, form);
    });
  },
  renderTableRows(tbody, rows, renderRow, emptyColspan = 4) {
    if (!tbody) return;
    if (!rows || !rows.length) {
      tbody.innerHTML = `<tr><td colspan="${emptyColspan}">No data available.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(renderRow).join('');
  },
  formatPercent(value) {
    return formatPercentValue(value);
  },
  progressBar(percent = 0, labelLeft = '', labelRight = '') {
    const safePercent = clampPercent(percent);
    const rightLabel = labelRight || formatPercentValue(percent);
    return `
      <div class="progress" role="group" aria-label="${labelLeft || 'Progress'}">
        <div class="progress-label">
          <span>${labelLeft}</span>
          <span>${rightLabel}</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${safePercent}">
          <div class="progress-fill" style="width:${safePercent}%"></div>
        </div>
      </div>
    `;
  },
  setFeedback(target, message = '', state = 'info') {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;
    el.textContent = message;
    el.dataset.state = state;
  }
};

const seedUsers = [
  {
    id: 'admin-seed',
    name: 'System Admin',
    email: 'admin@smartcoursecompanion.ca',
    password: 'Admin#1234',
    role: 'admin'
  },
  {
    id: 'student-seed',
    name: 'Demo Student',
    email: 'student@smartcoursecompanion.ca',
    password: 'Student#1234',
    role: 'student'
  }
];

const seedCourses = [
  {
    id: 'course-1',
    ownerUserId: 'student-seed',
    isGlobal: false,
    code: 'SOEN 287',
    name: 'Web Programming',
    instructor: 'Prof. Chen',
    term: 'Winter 2026',
    description: 'Student-managed Web Programming section.',
    enabled: true
  },
  {
    id: 'course-2',
    ownerUserId: 'student-seed',
    isGlobal: false,
    code: 'COMP 232',
    name: 'Mathematics for CS',
    instructor: 'Dr. Issa',
    term: 'Winter 2026',
    description: 'Student-managed Mathematics course.',
    enabled: true
  },
  {
    id: 'catalog-1',
    ownerUserId: null,
    isGlobal: true,
    code: 'SOEN 390',
    name: 'Software Engineering Project',
    instructor: 'Dr. Rey',
    term: 'Fall 2025',
    description: 'Capstone course coordinated by program admin.',
    enabled: true
  }
];

const seedAssessments = [
  {
    id: 'assessment-1',
    courseId: 'course-1',
    title: 'Project Proposal',
    category: 'Project',
    dueDate: '2026-02-20',
    earned: 18,
    total: 20,
    status: 'completed'
  },
  {
    id: 'assessment-2',
    courseId: 'course-2',
    title: 'Quiz 2',
    category: 'Quiz',
    dueDate: '2026-02-18',
    earned: null,
    total: 10,
    status: 'pending'
  }
];

const auth = {
  usersKey: 'sccUsers',
  currentKey: 'sccCurrentUser',
  ensureSeeded() {
    const existing = this.getUsers();
    if (!existing.length) {
      this.saveUsers(seedUsers);
    }
  },
  getUsers() {
    try {
      const raw = localStorage.getItem(this.usersKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  },
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.currentKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser(user) {
    localStorage.setItem(this.currentKey, JSON.stringify(user));
  },
  clearCurrentUser() {
    localStorage.removeItem(this.currentKey);
  },
  registerUser({ firstName, lastName, email, password, role = 'student' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = this.getUsers();
    if (users.some(user => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      email: normalizedEmail,
      password: normalizedPassword,
      role
    };
    users.push(newUser);
    this.saveUsers(users);
    const { password: _password, ...safeUser } = newUser;
    this.setCurrentUser(safeUser);
    return safeUser;
  },
  loginUser(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const user = this.getUsers().find(
      record => record.email === normalizedEmail && record.password === normalizedPassword
    );
    if (!user) {
      throw new Error('Invalid credentials. Please try again.');
    }
    const { password: _password, ...safeUser } = user;
    this.setCurrentUser(safeUser);
    return safeUser;
  },
  logout() {
    this.clearCurrentUser();
  }
};

const dataStore = {
  courseKey: 'sccCourses',
  assessmentKey: 'sccAssessments',
  templateKey: 'sccTemplates',
  ensureSeeded() {
    if (!localStorage.getItem(this.courseKey)) {
      this.saveCourses(seedCourses);
    }
    if (!localStorage.getItem(this.assessmentKey)) {
      this.saveAssessments(seedAssessments);
    }
    if (!localStorage.getItem(this.templateKey)) {
      this.saveTemplates([]);
    }
  },
  read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getCourses() {
    return this.read(this.courseKey);
  },
  saveCourses(courses) {
    this.write(this.courseKey, courses);
  },
  listCourses(user) {
    if (!user) return [];
    const courses = this.getCourses();
    if (user.role === 'student') {
      return courses.filter(course => course.ownerUserId === user.id && !course.isGlobal);
    }
    return courses;
  },
  listCatalogCourses() {
    return this.getCourses().filter(course => course.isGlobal);
  },
  findCatalogCourseByCode(code) {
    if (!code) return null;
    const normalized = code.trim().toLowerCase();
    return (
      this.listCatalogCourses().find(course => course.code.trim().toLowerCase() === normalized) || null
    );
  },
  getCourseById(courseId) {
    return this.getCourses().find(course => course.id === courseId) || null;
  },
  createCourse(data, user) {
    if (!user) throw new Error('Authentication required.');
    const courses = this.getCourses();
    const isGlobal = Boolean(data.isGlobal && user.role === 'admin');
    const ownerUserId = isGlobal ? null : user.role === 'student' ? user.id : data.ownerUserId || user.id;
    const course = {
      id: `course-${Date.now()}`,
      ownerUserId,
      isGlobal,
      code: data.code?.trim() || 'NEW-000',
      name: data.name?.trim() || 'Untitled Course',
      instructor: data.instructor?.trim() || user.name || 'Unassigned',
      term: data.term || 'TBD',
      description: data.description?.trim() || '',
      enabled: data.enabled ?? true
    };
    courses.push(course);
    this.saveCourses(courses);
    return course;
  },
  updateCourse(id, updates, user) {
    if (!user) throw new Error('Authentication required.');
    const courses = this.getCourses();
    const index = courses.findIndex(course => course.id === id);
    if (index === -1) throw new Error('Course not found.');
    this.assertStudentOwnership(courses[index], user);
    const isGlobal = courses[index].isGlobal;
    const ownerUserId = isGlobal ? null : user.role === 'student' ? user.id : updates.ownerUserId || courses[index].ownerUserId;
    courses[index] = {
      ...courses[index],
      ...updates,
      ownerUserId,
      isGlobal
    };
    this.saveCourses(courses);
    return courses[index];
  },
  deleteCourse(id, user) {
    if (!user) throw new Error('Authentication required.');
    const courses = this.getCourses();
    const index = courses.findIndex(course => course.id === id);
    if (index === -1) throw new Error('Course not found.');
    this.assertStudentOwnership(courses[index], user);
    courses.splice(index, 1);
    this.saveCourses(courses);
    // remove related assessments
    const assessments = this.getAssessments().filter(assessment => assessment.courseId !== id);
    this.saveAssessments(assessments);
  },
  getAssessments() {
    return this.read(this.assessmentKey);
  },
  saveAssessments(assessments) {
    this.write(this.assessmentKey, assessments);
  },
  listAssessments(user) {
    if (!user) return [];
    const assessments = this.getAssessments();
    if (user.role === 'student') {
      const courseIds = new Set(this.listCourses(user).map(course => course.id));
      return assessments.filter(assessment => courseIds.has(assessment.courseId));
    }
    return assessments;
  },
  getCourseAssessments(courseId, user) {
    if (!courseId || !user) return [];
    const course = this.getCourseById(courseId);
    if (!course) return [];
    this.assertStudentOwnership(course, user);
    return this.listAssessments(user).filter(assessment => assessment.courseId === courseId);
  },
  getCourseAverage(courseId, user) {
    const assessments = this.getCourseAssessments(courseId, user).filter(
      assessment => Number(assessment.total) > 0
    );
    if (!assessments.length) {
      return { percentage: null, earnedSum: 0, totalSum: 0 };
    }
    let earnedSum = 0;
    let totalSum = 0;
    assessments.forEach(assessment => {
      const total = Number(assessment.total);
      const earned = assessment.earned === '' || assessment.earned === null ? 0 : Number(assessment.earned);
      if (!Number.isFinite(total) || total <= 0) return;
      const safeEarned = Math.min(Math.max(earned, 0), total);
      totalSum += total;
      earnedSum += Number.isFinite(safeEarned) ? safeEarned : 0;
    });
    const percentage = totalSum > 0 ? Number(((earnedSum / totalSum) * 100).toFixed(1)) : null;
    return { percentage, earnedSum, totalSum };
  },
  createAssessment(data, user) {
    if (!user) throw new Error('Authentication required.');
    const course = this.getCourseById(data.courseId);
    if (!course) throw new Error('Course not found for assessment.');
    this.assertStudentOwnership(course, user);
    const assessments = this.getAssessments();
    const assessment = {
      id: `assessment-${Date.now()}`,
      courseId: course.id,
      title: data.title?.trim() || 'Untitled Assessment',
      category: data.category?.trim() || 'General',
      dueDate: data.dueDate || new Date().toISOString().slice(0, 10),
      earned: data.earned ?? null,
      total: data.total ?? null,
      status: data.status === 'completed' ? 'completed' : 'pending'
    };
    assessments.push(assessment);
    this.saveAssessments(assessments);
    return assessment;
  },
  updateAssessment(id, updates, user) {
    if (!user) throw new Error('Authentication required.');
    const assessments = this.getAssessments();
    const index = assessments.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Assessment not found.');
    const targetCourseId = updates.courseId || assessments[index].courseId;
    const course = this.getCourseById(targetCourseId);
    if (!course) throw new Error('Course missing for assessment.');
    this.assertStudentOwnership(course, user);
    assessments[index] = {
      ...assessments[index],
      ...updates,
      courseId: course.id,
      status: updates.status === 'completed' ? 'completed' : updates.status === 'pending' ? 'pending' : assessments[index].status
    };
    this.saveAssessments(assessments);
    return assessments[index];
  },
  deleteAssessment(id, user) {
    if (!user) throw new Error('Authentication required.');
    const assessments = this.getAssessments();
    const index = assessments.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Assessment not found.');
    const course = this.getCourseById(assessments[index].courseId);
    if (!course) throw new Error('Course missing for assessment.');
    this.assertStudentOwnership(course, user);
    assessments.splice(index, 1);
    this.saveAssessments(assessments);
  },
  getTemplates() {
    return this.read(this.templateKey);
  },
  saveTemplates(templates) {
    this.write(this.templateKey, templates);
  },
  listTemplates() {
    return this.getTemplates();
  },
  getTemplateById(id) {
    return this.getTemplates().find(template => template.id === id) || null;
  },
  createTemplate(data, user) {
    if (!user || user.role !== 'admin') throw new Error('Only admins can create templates.');
    const templates = this.getTemplates();
    const template = {
      id: `template-${Date.now()}`,
      ownerUserId: user.id,
      courseCode: data.courseCode?.trim(),
      courseName: data.courseName?.trim(),
      name: data.name?.trim(),
      description: data.description?.trim() || '',
      components: data.components || []
    };
    templates.push(template);
    this.saveTemplates(templates);
    return template;
  },
  updateTemplate(id, updates, user) {
    if (!user || user.role !== 'admin') throw new Error('Only admins can update templates.');
    const templates = this.getTemplates();
    const index = templates.findIndex(template => template.id === id);
    if (index === -1) throw new Error('Template not found.');
    templates[index] = {
      ...templates[index],
      ...updates
    };
    this.saveTemplates(templates);
    return templates[index];
  },
  deleteTemplate(id, user) {
    if (!user || user.role !== 'admin') throw new Error('Only admins can delete templates.');
    const templates = this.getTemplates();
    const index = templates.findIndex(template => template.id === id);
    if (index === -1) return;
    templates.splice(index, 1);
    this.saveTemplates(templates);
  },
  createCourseFromTemplate(templateId, user) {
    if (!user) throw new Error('Authentication required.');
    const template = this.getTemplateById(templateId);
    if (!template) throw new Error('Template not found.');
    if (!template.components?.length) throw new Error('Template must include at least one component.');
    const course = this.createCourse(
      {
        code: template.courseCode || template.name,
        name: template.courseName || template.name,
        instructor: user.name || 'TBD',
        term: 'TBD',
        description: template.description,
        enabled: true
      },
      user
    );
    template.components.forEach(component => {
      this.createAssessment(
        {
          courseId: course.id,
          title: component.category,
          category: component.category,
          dueDate: component.dueDate || new Date().toISOString().slice(0, 10),
          total: component.weight,
          earned: null,
          status: 'pending'
        },
        user
      );
    });
    return { course };
  },
  assertStudentOwnership(entity, user) {
    if (user.role === 'student' && entity.ownerUserId !== user.id) {
      throw new Error('Students can only access their own data.');
    }
  }
};
const pages = {
  'student-dashboard'() {
    const currentUser = auth.getCurrentUser();
    const coursesList = document.getElementById('activeCoursesList');
    const upcomingList = document.getElementById('upcomingAssessments');
    const progressChart = document.getElementById('progressChart');
    if (!currentUser || !coursesList || !upcomingList || !progressChart) return;

    const renderDashboard = () => {
      const courses = dataStore.listCourses(currentUser);
      const courseMap = new Map(courses.map(course => [course.id, course]));

      coursesList.innerHTML = courses.length
        ? courses
            .map(course => {
              const average = dataStore.getCourseAverage(course.id, currentUser);
              return `
              <li>
                <div>
                  <h3>${course.code} · ${course.name}</h3>
                  <p>${course.instructor} · ${course.term}</p>
                </div>
                ${helpers.progressBar(
                  average.percentage ?? 0,
                  'Average',
                  helpers.formatPercent(average.percentage)
                )}
                <p><a href="course-details.html?courseId=${encodeURIComponent(course.id)}">View details</a></p>
              </li>`;
            })
            .join('')
        : '<li class="muted">No courses yet. Add one from the Courses page.</li>';

      const upcomingAssessments = dataStore
        .listAssessments(currentUser)
        .filter(assessment => assessment.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

      upcomingList.innerHTML = upcomingAssessments.length
        ? upcomingAssessments
            .map(assessment => {
              const course = courseMap.get(assessment.courseId);
              const toggleLabel = assessment.status === 'completed' ? 'Mark Pending' : 'Mark Completed';
              const nextStatus = assessment.status === 'completed' ? 'pending' : 'completed';
              return `
              <li data-assessment-id="${assessment.id}">
                <strong>${assessment.title}</strong> · ${course ? course.code : 'Course'}<br />
                <small>Due ${new Date(assessment.dueDate).toLocaleDateString()} · <span class="badge ${assessment.status}">${assessment.status}</span></small><br />
                <button type="button" data-action="toggle-status" data-next-status="${nextStatus}" data-assessment-id="${assessment.id}">
                  ${toggleLabel}
                </button>
              </li>`;
            })
            .join('')
        : '<li class="muted">No upcoming assessments.</li>';

      progressChart.innerHTML = courses.length
        ? courses
            .map(course => {
              const average = dataStore.getCourseAverage(course.id, currentUser);
              return helpers.progressBar(
                average.percentage ?? 0,
                `${course.code} (${course.term})`,
                helpers.formatPercent(average.percentage)
              );
            })
            .join('')
        : '<p class="muted">Add courses to see progress visualization.</p>';
    };

    upcomingList.addEventListener('click', event => {
      const button = event.target.closest('button[data-action="toggle-status"]');
      if (!button) return;
      const { assessmentId, nextStatus } = button.dataset;
      if (!assessmentId || !nextStatus) return;
      try {
        dataStore.updateAssessment(
          assessmentId,
          { status: nextStatus },
          currentUser
        );
        renderDashboard();
      } catch (error) {
        alert(error.message);
      }
    });

    renderDashboard();
  },
  courses() {
    const currentUser = auth.getCurrentUser();
    const form = document.querySelector('form[data-form="course-manage"]');
    const feedback = document.getElementById('courseFormFeedback');
    const tableBody = document.getElementById('studentCourseTable');
    const resetBtn = document.querySelector('[data-action="reset-course-form"]');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const catalogMessage = document.getElementById('catalogRuleMessage');
    const templateSelect = document.querySelector('[data-select="course-template"]');
    const applyTemplateBtn = document.querySelector('[data-action="apply-template"]');

    if (!currentUser || !form || !tableBody) return;

    const updateCatalogMessage = () => {
      if (!catalogMessage) return;
      const catalogCourses = dataStore.listCatalogCourses();
      const enabledCourses = catalogCourses.filter(course => course.enabled);
      if (!catalogCourses.length) {
        catalogMessage.textContent =
          'No admin catalog courses available yet. You can create custom courses by using unique codes.';
      } else {
        catalogMessage.textContent = `Catalog courses available: ${enabledCourses
          .map(course => `${course.code}${course.enabled ? '' : ' (disabled)'}`)
          .join(', ')}. Disabled catalog courses cannot be added unless you create a custom course with a different code.`;
      }
    };

    updateCatalogMessage();
    const populateTemplateOptions = () => {
      if (!templateSelect || !applyTemplateBtn) return;
      const templates = dataStore.listTemplates();
      templateSelect.innerHTML =
        '<option value="">Select template</option>' +
        templates.map(template => `<option value="${template.id}">${template.courseCode} · ${template.name}</option>`).join('');
      applyTemplateBtn.disabled = templates.length === 0;
    };

    populateTemplateOptions();

    const showFeedback = (message = '', type = 'info') => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.dataset.state = type;
    };

    const setFormState = course => {
      form.reset();
      form.courseId.value = course?.id || '';
      form.code.value = course?.code || '';
      form.name.value = course?.name || '';
      form.instructor.value = course?.instructor || '';
      form.term.value = course?.term || '';
      form.enabled.checked = course?.enabled ?? true;
      if (submitBtn) submitBtn.textContent = course ? 'Update Course' : 'Save Course';
    };

    const renderCourses = () => {
      const rows = dataStore.listCourses(currentUser);
      helpers.renderTableRows(
        tableBody,
        rows,
        course => `
          <tr data-course-row="${course.id}">
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.instructor}</td>
            <td>${course.term}</td>
            <td><span class="badge ${course.enabled ? 'completed' : 'pending'}">${course.enabled ? 'Enabled' : 'Disabled'}</span></td>
            <td>
              <div class="table-actions">
                <button type="button" data-action="view-course" data-course-id="${course.id}">View</button>
                <button type="button" data-action="edit-course" data-course-id="${course.id}">Edit</button>
                <button type="button" data-action="delete-course" data-course-id="${course.id}" class="danger">Delete</button>
              </div>
            </td>
          </tr>`,
        6
      );
    };

    const handleSubmit = event => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        courseId: formData.get('courseId') || '',
        code: (formData.get('code') || '').trim(),
        name: (formData.get('name') || '').trim(),
        instructor: (formData.get('instructor') || '').trim(),
        term: (formData.get('term') || '').trim(),
        enabled: form.elements.enabled.checked
      };

      try {
        validateCoursePayload(payload);
        const catalogMatch = dataStore.findCatalogCourseByCode(payload.code);
        if (catalogMatch && !catalogMatch.enabled) {
          throw new Error('This catalog course is disabled. Choose another enabled course or change the code to create a custom course.');
        }
        if (payload.courseId) {
          dataStore.updateCourse(
            payload.courseId,
            {
              code: payload.code,
              name: payload.name,
              instructor: payload.instructor,
              term: payload.term,
              enabled: payload.enabled
            },
            currentUser
          );
          showFeedback('Course updated successfully.', 'success');
        } else {
          dataStore.createCourse(
            {
              code: payload.code,
              name: payload.name,
              instructor: payload.instructor,
              term: payload.term,
              enabled: payload.enabled
            },
            currentUser
          );
          showFeedback('Course added successfully.', 'success');
        }
        setFormState(null);
        renderCourses();
      } catch (error) {
        showFeedback(error.message, 'error');
      }
    };

    const handleTableClick = event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const courseId = button.dataset.courseId;
      if (!courseId) return;
      const action = button.dataset.action;
      const course = dataStore.listCourses(currentUser).find(item => item.id === courseId);
      if (action === 'view-course') {
        window.location.href = `course-details.html?courseId=${encodeURIComponent(courseId)}`;
      } else if (action === 'edit-course' && course) {
        setFormState(course);
        showFeedback('Editing course. Update the fields and save.', 'info');
      } else if (action === 'delete-course') {
        if (confirm('Delete this course and its assessments?')) {
          try {
            dataStore.deleteCourse(courseId, currentUser);
            showFeedback('Course deleted.', 'success');
            renderCourses();
            if (form.courseId.value === courseId) {
              setFormState(null);
            }
          } catch (error) {
            showFeedback(error.message, 'error');
          }
        }
      }
    };

    form.addEventListener('submit', handleSubmit);
    tableBody.addEventListener('click', handleTableClick);
    resetBtn?.addEventListener('click', () => {
      setFormState(null);
      showFeedback('');
    });

    applyTemplateBtn?.addEventListener('click', () => {
      const templateId = templateSelect?.value;
      if (!templateId) {
        showFeedback('Select a template first.', 'error');
        return;
      }
      try {
        const { course } = dataStore.createCourseFromTemplate(templateId, currentUser);
        showFeedback(`Course ${course.code} created from template.`, 'success');
        setFormState(null);
        renderCourses();
      } catch (error) {
        showFeedback(error.message, 'error');
      }
    });

    setFormState(null);
    renderCourses();
  },
  'course-details'() {
    const currentUser = auth.getCurrentUser();
    const courseId = getQueryParam('courseId');
    const heading = document.getElementById('courseTitle');
    const summary = document.getElementById('courseSummary');
    const codeEl = document.getElementById('courseCode');
    const creditsEl = document.getElementById('courseCredits');
    const termEl = document.getElementById('courseTerm');
    const descriptionEl = document.getElementById('courseDescription');
    const assessmentTableBody = document.getElementById('courseAssessmentRows');
    const addAssessmentLink = document.getElementById('addAssessmentLink');
    const assessmentForm = document.querySelector('form[data-form="assessment-edit"]');
    const assessmentFeedback = document.getElementById('assessmentFormFeedback');
    const resetAssessmentBtn = document.querySelector('[data-action="reset-assessment-form"]');

    if (!courseId || !currentUser || !heading) {
      showCourseDetailsFallback();
      return;
    }

    const course = dataStore.listCourses(currentUser).find(item => item.id === courseId);
    if (!course) {
      showCourseDetailsFallback();
      return;
    }
    if (addAssessmentLink) {
      addAssessmentLink.href = `assessment-form.html?courseId=${encodeURIComponent(course.id)}`;
    }

    heading.textContent = `${course.code} · ${course.name}`;
    summary.textContent = `${course.instructor} · ${course.term}`;
    codeEl.textContent = course.code;
    creditsEl.textContent = course.enabled ? 'Active' : 'Disabled';
    termEl.textContent = course.term;
    descriptionEl.textContent = course.description || `${course.name} instructed by ${course.instructor}.`;
    const averageValueEl = document.getElementById('courseAverageValue');
    const averageBar = document.getElementById('courseAverageBar');
    const averageTrack = document.querySelector('#courseAverageSummary .progress-track');
    const updateAverageDisplay = () => {
      const averageSnapshot = dataStore.getCourseAverage(course.id, currentUser);
      if (averageValueEl) {
        averageValueEl.textContent = helpers.formatPercent(averageSnapshot.percentage);
      }
      if (averageBar) {
        const percent = clampPercent(averageSnapshot.percentage ?? 0);
        averageBar.style.width = `${percent}%`;
        if (averageTrack) {
          averageTrack.setAttribute('aria-valuenow', String(percent));
        }
      }
    };

    let courseAssessments = [];

    const showAssessmentFeedback = (message = '', state = 'info') => {
      if (!assessmentFeedback) return;
      assessmentFeedback.textContent = message;
      assessmentFeedback.dataset.state = state;
    };

    const setAssessmentFormState = (assessment, silent = false) => {
      if (!assessmentForm) return;
      assessmentForm.reset();
      assessmentForm.assessmentId.value = assessment?.id || '';
      assessmentForm.title.value = assessment?.title || '';
      assessmentForm.category.value = assessment?.category || '';
      assessmentForm.dueDate.value = assessment?.dueDate || '';
      assessmentForm.earned.value = assessment?.earned ?? '';
      assessmentForm.total.value = assessment?.total ?? '';
      assessmentForm.status.value = assessment?.status || 'pending';
      if (!silent) {
        if (!assessment) {
          showAssessmentFeedback('Select an assessment to edit.', 'info');
        } else {
          showAssessmentFeedback(`Editing ${assessment.title}`, 'info');
        }
      }
    };

    const refreshAssessments = () => {
      if (!assessmentTableBody) return;
      courseAssessments = dataStore
        .listAssessments(currentUser)
        .filter(assessment => assessment.courseId === course.id);
      helpers.renderTableRows(
        assessmentTableBody,
        courseAssessments,
        ({ id, title, category, dueDate, status, total, earned }) => `
          <tr>
            <td>${title}</td>
            <td>${category}</td>
            <td>${new Date(dueDate).toLocaleDateString()}</td>
            <td><span class="badge ${status}">${status}</span></td>
            <td>${earned != null && total != null ? `${earned}/${total}` : '—'}</td>
            <td>
              <div class="table-actions">
                <button type="button" data-action="edit-assessment" data-assessment-id="${id}">Edit</button>
                <button type="button" data-action="delete-assessment" data-assessment-id="${id}" class="danger">Delete</button>
              </div>
            </td>
          </tr>`,
        6
      );
    };

    const handleAssessmentSubmit = event => {
      event.preventDefault();
      if (!assessmentForm) return;
      const formData = new FormData(assessmentForm);
      const payload = {
        assessmentId: formData.get('assessmentId'),
        title: (formData.get('title') || '').trim(),
        category: (formData.get('category') || '').trim(),
        dueDate: formData.get('dueDate') || '',
        total: formData.get('total'),
        earned: formData.get('earned'),
        status: formData.get('status') || 'pending'
      };

      try {
        const { totalValue, earnedValue } = validateAssessmentPayload(payload);
        if (!payload.assessmentId) {
          throw new Error('Select an assessment before saving changes.');
        }
        dataStore.updateAssessment(
          payload.assessmentId,
          {
            title: payload.title,
            category: payload.category,
            dueDate: payload.dueDate,
            total: totalValue,
            earned: earnedValue,
            status: payload.status,
            courseId: course.id
          },
          currentUser
        );
        showAssessmentFeedback('Assessment updated.', 'success');
        setAssessmentFormState(null, true);
        refreshAssessments();
        updateAverageDisplay();
      } catch (error) {
        showAssessmentFeedback(error.message, 'error');
      }
    };

    const handleAssessmentTableClick = event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const { assessmentId } = button.dataset;
      const assessment = courseAssessments.find(item => item.id === assessmentId);
      if (!assessmentId) return;
      if (button.dataset.action === 'edit-assessment') {
        if (!assessment) {
          showAssessmentFeedback('Assessment not found.', 'error');
          return;
        }
        setAssessmentFormState(assessment);
      } else if (button.dataset.action === 'delete-assessment') {
        if (!assessment) {
          showAssessmentFeedback('Assessment not found.', 'error');
          return;
        }
        if (confirm('Delete this assessment?')) {
          try {
            dataStore.deleteAssessment(assessmentId, currentUser);
            showAssessmentFeedback('Assessment deleted.', 'success');
            if (assessmentForm?.assessmentId.value === assessmentId) {
              setAssessmentFormState(null, true);
            }
            refreshAssessments();
            updateAverageDisplay();
          } catch (error) {
            showAssessmentFeedback(error.message, 'error');
          }
        }
      }
    };

    assessmentForm?.addEventListener('submit', handleAssessmentSubmit);
    assessmentTableBody?.addEventListener('click', handleAssessmentTableClick);
    resetAssessmentBtn?.addEventListener('click', () => setAssessmentFormState(null));

    setAssessmentFormState(null);
    refreshAssessments();
    updateAverageDisplay();

    helpers.renderList(
      document.getElementById('learningOutcomes'),
      [
        'Stay organized by tracking every course component.',
        'Monitor assessment completion and grading progress.',
        'Share consistent course data with advisors and admins.'
      ],
      text => `<li>${text}</li>`
    );
  },
  'assessment-form'() {
    const currentUser = auth.getCurrentUser();
    const courseSelect = document.querySelector('select[name="course"]');
    const feedback = document.getElementById('assessmentFeedback');
    const form = document.querySelector('form[data-form="assessment"]');
    if (courseSelect && currentUser) {
      const courses = dataStore.listCourses(currentUser);
      courseSelect.innerHTML = courses.length
        ? courses.map(course => `<option value="${course.id}">${course.code} · ${course.name}</option>`).join('')
        : '<option value="">No courses available</option>';
      const preselect = getQueryParam('courseId');
      if (preselect) {
        courseSelect.value = preselect;
      }
    }

    helpers.handleForm('form[data-form="assessment"]', data => {
      if (!currentUser) {
        helpers.setFeedback(feedback, 'Please log in.', 'error');
        return;
      }
      try {
        const payload = {
          courseId: data.course,
          title: data.title,
          category: data.type,
          dueDate: data.dueDate,
          total: Number(data.weight),
          earned: null,
          status: 'pending'
        };
        validateAssessmentPayload({
          ...payload,
          total: payload.total,
          earned: payload.earned
        });
        const course = dataStore.getCourseById(payload.courseId);
        if (!course) throw new Error('Select a valid course.');
        dataStore.createAssessment(payload, currentUser);
        helpers.setFeedback(feedback, `Assessment queued for ${course.code}.`, 'success');
        form?.reset();
      } catch (error) {
        helpers.setFeedback(feedback, error.message, 'error');
      }
    });
  },
  'admin-dashboard'() {
    helpers.renderList(
      document.getElementById('pendingApprovals'),
      [
        { text: 'Dr. Carter requested new COMP 335 course shell.' },
        { text: 'SOEN 390 assessment update awaiting review.' }
      ],
      ({ text }) => `<li>${text}</li>`
    );

    helpers.renderList(
      document.getElementById('adminNotifications'),
      mockData.alerts,
      ({ level, message }) => `<li><strong>${level.toUpperCase()}:</strong> ${message}</li>`
    );
  },
  'admin-courses'() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') return;
    const form = document.querySelector('form[data-form="admin-course"]');
    const feedback = document.getElementById('adminCourseFeedback');
    const tableBody = document.getElementById('adminCourseTable');
    const resetBtn = document.querySelector('[data-action="reset-admin-course-form"]');
    if (!form || !tableBody) return;

    const showFeedback = (message = '', type = 'info') => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.dataset.state = type;
    };

    const setFormState = course => {
      form.reset();
      form.courseId.value = course?.id || '';
      form.code.value = course?.code || '';
      form.title.value = course?.name || '';
      form.instructor.value = course?.instructor || '';
      form.term.value = course?.term || '';
      form.description.value = course?.description || '';
      form.enabled.checked = course?.enabled ?? true;
      showFeedback(course ? `Editing ${course.code}` : 'Enabled catalog courses become available to students.');
    };

    const renderCatalog = () => {
      const catalog = dataStore.listCatalogCourses();
      helpers.renderTableRows(
        tableBody,
        catalog,
        course => `
          <tr data-course-id="${course.id}">
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.term}</td>
          <td><span class="badge ${course.enabled ? 'completed' : 'pending'}">${course.enabled ? 'Enabled' : 'Disabled'}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" data-action="edit" data-course-id="${course.id}">Edit</button>
                <button type="button" data-action="toggle" data-course-id="${course.id}">
                  ${course.enabled ? 'Disable' : 'Enable'}
                </button>
                <button type="button" class="danger" data-action="delete" data-course-id="${course.id}">Delete</button>
              </div>
            </td>
          </tr>`,
        5
      );
    };

    const handleSubmit = event => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        courseId: formData.get('courseId'),
        code: (formData.get('code') || '').trim(),
        name: (formData.get('title') || '').trim(),
        instructor: (formData.get('instructor') || '').trim(),
        term: (formData.get('term') || '').trim(),
        description: (formData.get('description') || '').trim(),
        enabled: form.elements.enabled.checked
      };
      try {
        validateCoursePayload(payload);
        if (payload.courseId) {
          dataStore.updateCourse(
            payload.courseId,
            {
              code: payload.code,
              name: payload.name,
              instructor: payload.instructor,
              term: payload.term,
              description: payload.description,
              enabled: payload.enabled
            },
            currentUser
          );
          showFeedback(`Updated ${payload.code}.`, 'success');
        } else {
          dataStore.createCourse(
            {
              code: payload.code,
              name: payload.name,
              instructor: payload.instructor,
              term: payload.term,
              description: payload.description,
              enabled: payload.enabled,
              isGlobal: true
            },
            currentUser
          );
          showFeedback(`Created catalog course ${payload.code}.`, 'success');
        }
        setFormState(null);
        renderCatalog();
      } catch (error) {
        showFeedback(error.message, 'error');
      }
    };

    const handleTableClick = event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const { courseId, action } = button.dataset;
      if (!courseId || !action) return;
      const course = dataStore.listCatalogCourses().find(item => item.id === courseId);
      if (!course) {
        showFeedback('Course not found.', 'error');
        return;
      }
      if (action === 'edit') {
        setFormState(course);
      } else if (action === 'toggle') {
        dataStore.updateCourse(
          courseId,
          { enabled: !course.enabled },
          currentUser
        );
        renderCatalog();
      } else if (action === 'delete') {
        if (confirm(`Delete catalog course ${course.code}?`)) {
          dataStore.deleteCourse(courseId, currentUser);
          if (form.courseId.value === courseId) {
            setFormState(null);
          }
          renderCatalog();
        }
      }
    };

    form.addEventListener('submit', handleSubmit);
    tableBody.addEventListener('click', handleTableClick);
    resetBtn?.addEventListener('click', () => setFormState(null));

    setFormState(null);
    renderCatalog();
  },
  'admin-templates'() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') return;
    const form = document.querySelector('form[data-form="template"]');
    const componentsList = form?.querySelector('.components-list');
    const addComponentBtn = form?.querySelector('[data-action="addComponent"]');
    const feedback = document.getElementById('templateFeedback');
    const tableBody = document.getElementById('adminTemplateTable');
    const resetBtn = form?.querySelector('[data-action="reset-template-form"]');
    if (!form || !componentsList || !addComponentBtn || !tableBody) return;

    const showFeedback = (message = '', state = 'info') => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.dataset.state = state;
    };

    const addComponentRow = (component = {}) => {
      const row = document.createElement('div');
      row.className = 'component-row';
      row.innerHTML = `
        <label>Category
          <input type="text" name="componentCategory" value="${component.category || ''}" required />
        </label>
        <label>Weight (%)
          <input type="number" name="componentWeight" value="${component.weight ?? ''}" min="1" max="100" step="0.1" required />
        </label>
        <button type="button" data-action="removeComponent">Remove</button>
      `;
      componentsList.appendChild(row);
    };

    const clearComponents = () => {
      componentsList.innerHTML = '';
      addComponentRow();
    };

    const getComponentsPayload = () =>
      Array.from(componentsList.querySelectorAll('.component-row')).map(row => ({
        category: row.querySelector('[name="componentCategory"]')?.value || '',
        weight: row.querySelector('[name="componentWeight"]')?.value
      }));

    const setFormState = template => {
      form.reset();
      clearComponents();
      if (template) {
        form.templateId.value = template.id;
        form.courseCode.value = template.courseCode || '';
        form.courseName.value = template.courseName || '';
        form.name.value = template.name || '';
        form.description.value = template.description || '';
        componentsList.innerHTML = '';
        template.components.forEach(component => addComponentRow(component));
        showFeedback(`Editing template ${template.name}.`, 'info');
      } else {
        showFeedback('Add components so weights total 100%.', 'info');
      }
    };

    const renderTemplates = () => {
      const templates = dataStore.listTemplates();
      helpers.renderTableRows(
        tableBody,
        templates,
        template => `
          <tr data-template-id="${template.id}">
            <td>${template.name}</td>
            <td>${template.courseCode} · ${template.courseName}</td>
            <td>${template.components.map(component => `${component.category} (${component.weight}%)`).join(', ')}</td>
            <td>
              <div class="table-actions">
                <button type="button" data-action="edit-template" data-template-id="${template.id}">Edit</button>
                <button type="button" class="danger" data-action="delete-template" data-template-id="${template.id}">Delete</button>
              </div>
            </td>
          </tr>`,
        4
      );
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      const components = getComponentsPayload();
      try {
        const normalizedComponents = validateTemplatePayload({
          courseCode: form.courseCode.value,
          courseName: form.courseName.value,
          name: form.name.value,
          components
        });
        const payload = {
          courseCode: form.courseCode.value.trim(),
          courseName: form.courseName.value.trim(),
          name: form.name.value.trim(),
          description: form.description.value.trim(),
          components: normalizedComponents
        };
        if (form.templateId.value) {
          dataStore.updateTemplate(form.templateId.value, payload, currentUser);
          showFeedback('Template updated.', 'success');
        } else {
          dataStore.createTemplate(payload, currentUser);
          showFeedback('Template created.', 'success');
        }
        setFormState(null);
        renderTemplates();
      } catch (error) {
        showFeedback(error.message, 'error');
      }
    });

    addComponentBtn.addEventListener('click', () => addComponentRow());

    componentsList.addEventListener('click', event => {
      if (event.target.matches('[data-action="removeComponent"]')) {
        const row = event.target.closest('.component-row');
        row?.remove();
        if (!componentsList.querySelector('.component-row')) {
          addComponentRow();
        }
      }
    });

    tableBody.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const { templateId } = button.dataset;
      if (!templateId) return;
      const template = dataStore.getTemplateById(templateId);
      if (!template) {
        showFeedback('Template not found.', 'error');
        return;
      }
      if (button.dataset.action === 'edit-template') {
        setFormState(template);
      } else if (button.dataset.action === 'delete-template') {
        if (confirm(`Delete template ${template.name}?`)) {
          dataStore.deleteTemplate(templateId, currentUser);
          if (form.templateId.value === templateId) {
            setFormState(null);
          }
          renderTemplates();
          showFeedback('Template deleted.', 'success');
        }
      }
    });

    resetBtn?.addEventListener('click', () => setFormState(null));

    setFormState(null);
    renderTemplates();
  },
  'admin-stats'() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') return;
    const studentCountEl = document.getElementById('totalStudentsCount');
    const completionSummary = document.getElementById('completionSummary');
    const courseCompletionList = document.getElementById('courseCompletionList');
    if (!studentCountEl || !completionSummary || !courseCompletionList) return;

    const students = auth.getUsers().filter(user => user.role === 'student');
    studentCountEl.textContent = String(students.length);

    const assessments = dataStore.getAssessments();
    const completedAssessments = assessments.filter(assessment => assessment.status === 'completed').length;
    const completionPercent = assessments.length ? (completedAssessments / assessments.length) * 100 : null;
    completionSummary.innerHTML = assessments.length
      ? helpers.progressBar(
          completionPercent ?? 0,
          'Completed',
          `${completedAssessments}/${assessments.length} (${helpers.formatPercent(completionPercent)})`
        )
      : '<p class="muted">No assessments submitted yet.</p>';

    const courses = dataStore.getCourses();
    const perCourseStats = courses
      .map(course => {
        const relatedAssessments = assessments.filter(assessment => assessment.courseId === course.id);
        const total = relatedAssessments.length;
        const completed = relatedAssessments.filter(assessment => assessment.status === 'completed').length;
        const percentage = total ? (completed / total) * 100 : null;
        return {
          id: course.id,
          code: course.code || 'Custom Course',
          name: course.name || 'Custom Course',
          total,
          completed,
          percentage
        };
      })
      .filter(stat => stat.total > 0);

    courseCompletionList.innerHTML = perCourseStats.length
      ? perCourseStats
          .map(stat =>
            helpers.progressBar(
              stat.percentage ?? 0,
              `${stat.code} · ${stat.name}`,
              `${stat.completed}/${stat.total} (${helpers.formatPercent(stat.percentage)})`
            )
          )
          .join('')
      : '<p class="muted">No course activity recorded yet.</p>';
  },
  login() {
    helpers.handleForm('form[data-form="login"]', data => {
      try {
        validateLoginForm(data);
        const user = auth.loginUser(data.email.trim().toLowerCase(), data.password.trim());
        applyRoleNavigation();
        alert(`Logged in as ${user.role}`);
        const destination = user.role === 'student' ? 'student-dashboard.html' : 'admin-dashboard.html';
        window.location.href = destination;
      } catch (error) {
        alert(error.message);
      }
    });
  },
  register() {
    helpers.handleForm('form[data-form="register"]', data => {
      try {
        validateRegistrationForm(data);
        const user = auth.registerUser({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password.trim(),
          role: 'student'
        });
        applyRoleNavigation();
        alert(`Account created for ${user.name}`);
        window.location.href = 'student-dashboard.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }
};

function applyRoleNavigation() {
  const currentUser = auth.getCurrentUser();
  const role = currentUser?.role;
  document.querySelectorAll('[data-role]').forEach(link => {
    const parent = link.closest('li');
    if (!parent) return;
    const target = link.dataset.role;
    let visible = true;
    if (target === 'student') {
      visible = role === 'student';
    } else if (target === 'admin') {
      visible = role === 'admin';
    }
    parent.hidden = !visible;
  });
  toggleLogoutControl(Boolean(currentUser));
}

function initNavigationState() {
  const current = location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.primary-nav a').forEach(anchor => {
    if (anchor.getAttribute('href').includes(current)) {
      anchor.classList.add('active');
    }
  });
}

function initNavToggle() {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (!nav || !toggle) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function toggleLogoutControl(isLoggedIn) {
  const nav = document.querySelector('[data-nav] ul');
  if (!nav) return;
  let logoutItem = nav.querySelector('[data-nav-logout]');
  if (!logoutItem) {
    logoutItem = document.createElement('li');
    logoutItem.setAttribute('data-nav-logout', '');
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.dataset.action = 'logout';
    logoutLink.textContent = 'Logout';
    logoutLink.addEventListener('click', event => {
      event.preventDefault();
      auth.logout();
      applyRoleNavigation();
      window.location.href = 'login.html';
    });
    logoutItem.appendChild(logoutLink);
    nav.appendChild(logoutItem);
  }
  logoutItem.hidden = !isLoggedIn;
}

const routeRules = {
  'student-dashboard': { auth: true, roles: ['student'] },
  courses: { auth: true, roles: ['student'] },
  'course-details': { auth: true, roles: ['student'] },
  'assessment-form': { auth: true, roles: ['student'] },
  'admin-dashboard': { auth: true, roles: ['admin'] },
  'admin-courses': { auth: true, roles: ['admin'] },
  'admin-templates': { auth: true, roles: ['admin'] },
  'admin-stats': { auth: true, roles: ['admin'] }
};

function validateRegistrationForm(data) {
  const errors = [];
  if (!data.firstName?.trim()) errors.push('First name is required.');
  if (!data.lastName?.trim()) errors.push('Last name is required.');
  if (!data.email?.trim()) errors.push('Email is required.');
  if (data.email && !isValidEmail(data.email)) errors.push('Please provide a valid email address.');
  if (!data.password || data.password.length < 8) errors.push('Password must be at least 8 characters.');
  if (data.password !== data.confirmPassword) errors.push('Passwords do not match.');
  if (errors.length) throw new Error(errors.join('\n'));
}

function validateLoginForm(data) {
  const errors = [];
  if (!data.email?.trim()) errors.push('Email is required.');
  if (data.email && !isValidEmail(data.email)) errors.push('Please enter a valid email.');
  if (!data.password || data.password.length < 8) errors.push('Password must be at least 8 characters.');
  if (errors.length) throw new Error(errors.join('\n'));
}

function validateCoursePayload(data) {
  const errors = [];
  if (!data.code) errors.push('Course code is required.');
  if (!data.name) errors.push('Course name is required.');
  if (!data.instructor) errors.push('Instructor name is required.');
  if (!data.term) errors.push('Term is required.');
  if (errors.length) throw new Error(errors.join('\n'));
}

function validateTemplatePayload(data) {
  const errors = [];
  if (!data.courseCode?.trim()) errors.push('Course code is required.');
  if (!data.courseName?.trim()) errors.push('Course name is required.');
  if (!data.name?.trim()) errors.push('Template name is required.');
  if (!Array.isArray(data.components) || !data.components.length) {
    errors.push('At least one component is required.');
  }
  const normalizedComponents = (data.components || []).map(component => {
    const category = component.category?.trim();
    const weight = Number(component.weight);
    return { category, weight };
  });
  normalizedComponents.forEach(component => {
    if (!component.category) {
      errors.push('Component category is required.');
    }
    if (!Number.isFinite(component.weight) || component.weight <= 0) {
      errors.push('Component weight must be a positive number.');
    }
  });
  const total = normalizedComponents.reduce((sum, component) => sum + (component.weight || 0), 0);
  if (Math.abs(total - 100) > 0.5) {
    errors.push('Component weights must sum to 100%.');
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return normalizedComponents;
}

function validateAssessmentPayload(data) {
  const errors = [];
  if (!data.title) errors.push('Assessment title is required.');
  if (!data.category) errors.push('Assessment category is required.');
  if (!data.dueDate) errors.push('Due date is required.');
  const totalValue = Number(data.total);
  if (!Number.isFinite(totalValue) || totalValue <= 0) {
    errors.push('Total marks must be a positive number.');
  }
  let earnedValue = null;
  if (data.earned !== '' && data.earned !== null && data.earned !== undefined) {
    earnedValue = Number(data.earned);
    if (!Number.isFinite(earnedValue) || earnedValue < 0) {
      errors.push('Earned marks must be zero or greater.');
    } else if (Number.isFinite(totalValue) && earnedValue > totalValue) {
      errors.push('Earned marks cannot exceed total marks.');
    }
  }
  if (!['pending', 'completed'].includes(data.status)) {
    errors.push('Status must be pending or completed.');
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { totalValue, earnedValue };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function enforceRouteGuard(pageKey) {
  const guard = routeRules[pageKey];
  if (!guard) return false;
  const currentUser = auth.getCurrentUser();
  if (guard.auth && !currentUser) {
    window.location.href = 'login.html';
    return true;
  }
  if (guard.roles && currentUser && !guard.roles.includes(currentUser.role)) {
    const fallback = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
    window.location.href = fallback;
    return true;
  }
  return false;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showCourseDetailsFallback() {
  const container = document.querySelector('main');
  if (!container) return;
  container.innerHTML = `
    <section class="card">
      <h2>Course unavailable</h2>
      <p>You either selected an invalid course or do not have permission to view it.</p>
      <a class="btn" href="courses.html">Back to Courses</a>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  auth.ensureSeeded();
  dataStore.ensureSeeded();
  initNavToggle();
  applyRoleNavigation();
  initNavigationState();
  document.querySelector('[data-action="seed-demo"]')?.addEventListener('click', () => {
    if (confirm('Replace current data with demo data?')) {
      seedDemoData();
    }
  });
  const pageKey = location.pathname.split('/').pop().replace('.html', '') || 'index';
  if (enforceRouteGuard(pageKey)) return;
  pages[pageKey]?.();
});

window.addEventListener('storage', event => {
  if (event.key === auth.currentKey || event.key === auth.usersKey) {
    applyRoleNavigation();
  }
});
