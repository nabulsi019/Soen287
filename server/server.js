const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const createAuthRoutes = require('./routes/auth');
const createCourseRoutes = require('./routes/courses');
const createAssessmentRoutes = require('./routes/assessments');
const createAdminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const DEFAULT_DB = {
  users: [],
  adminCourses: [],
  adminCourseAssessments: [],
  enrollments: [],
  assessments: []
};

function normalizeDB(data) {
  return {
    users: Array.isArray(data.users) ? data.users : [],
    adminCourses: Array.isArray(data.adminCourses) ? data.adminCourses : [],
    adminCourseAssessments: Array.isArray(data.adminCourseAssessments) ? data.adminCourseAssessments : [],
    enrollments: Array.isArray(data.enrollments) ? data.enrollments : [],
    assessments: Array.isArray(data.assessments) ? data.assessments : []
  };
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(normalizeDB(data), null, 2));
}

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(DEFAULT_DB);
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const parsed = raw ? JSON.parse(raw) : DEFAULT_DB;
  const normalized = normalizeDB(parsed);

  if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
    writeDB(normalized);
  }

  return normalized;
}

function seedAdminUser() {
  const db = readDB();
  const adminExists = db.users.some(function (user) {
    return user.role === 'admin';
  });

  if (adminExists) {
    return;
  }

  db.users.push({
    id: Date.now(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@scc.ca',
    password: bcrypt.hashSync('Admin1234', 10),
    role: 'admin'
  });

  writeDB(db);
  console.log('Seeded default admin: admin@scc.ca / Admin1234');
}

seedAdminUser();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'smart-course-companion-session',
  resave: false,
  saveUninitialized: false
}));

app.use('/api/auth', createAuthRoutes({
  readDB: readDB,
  writeDB: writeDB
}));
app.use('/api', createCourseRoutes({
  readDB: readDB,
  writeDB: writeDB
}));
app.use('/api', createAssessmentRoutes({
  readDB: readDB,
  writeDB: writeDB
}));
app.use('/api', createAdminRoutes({
  readDB: readDB,
  writeDB: writeDB
}));

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', function (req, res) {
  res.status(404).json({ error: 'API route not found.' });
});

app.listen(PORT, function () {
  console.log('Smart Course Companion server running on http://localhost:' + PORT);
});
