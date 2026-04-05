const express = require('express');

const authMiddleware = require('../middleware/auth');

function requireStudent(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Login required.' });
  }

  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Student access required.' });
  }

  next();
}

function calculateCourseAverage(assessments) {
  const scoredAssessments = assessments.filter(function (assessment) {
    return assessment.earned !== null &&
      assessment.earned !== '' &&
      assessment.earned !== undefined &&
      assessment.total !== null &&
      assessment.total !== '' &&
      assessment.total !== undefined &&
      Number(assessment.total) > 0;
  });

  if (scoredAssessments.length === 0) {
    return null;
  }

  const totalEarned = scoredAssessments.reduce(function (sum, assessment) {
    return sum + Number(assessment.earned);
  }, 0);
  const totalPossible = scoredAssessments.reduce(function (sum, assessment) {
    return sum + Number(assessment.total);
  }, 0);

  if (totalPossible <= 0) {
    return null;
  }

  return Number((totalEarned / totalPossible * 100).toFixed(1));
}

function buildEnrollmentResponse(db, enrollment) {
  const enrollmentAssessments = db.assessments.filter(function (assessment) {
    return assessment.userId === enrollment.userId && assessment.courseId === enrollment.id;
  });
  const completedAssessmentCount = enrollmentAssessments.filter(function (assessment) {
    return assessment.status === 'completed';
  }).length;

  return Object.assign({}, enrollment, {
    currentAverage: calculateCourseAverage(enrollmentAssessments),
    assessmentCount: enrollmentAssessments.length,
    completedAssessmentCount: completedAssessmentCount
  });
}

function sortByDueDate(a, b) {
  if (a.dueDate && b.dueDate) {
    return a.dueDate.localeCompare(b.dueDate);
  }

  if (a.dueDate) {
    return -1;
  }

  if (b.dueDate) {
    return 1;
  }

  return 0;
}

module.exports = function createCourseRoutes(dbHelpers) {
  const router = express.Router();
  const readDB = dbHelpers.readDB;
  const writeDB = dbHelpers.writeDB;

  router.get('/courses', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const userId = req.session.user.id;
    const enrollments = db.enrollments
      .filter(function (enrollment) {
        return enrollment.userId === userId;
      })
      .map(function (enrollment) {
        return buildEnrollmentResponse(db, enrollment);
      });

    res.json(enrollments);
  });

  router.get('/courses/available', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const term = (req.query.term || '').trim();
    const courses = db.adminCourses.filter(function (course) {
      if (!course.enabled) {
        return false;
      }

      if (term && course.term !== term) {
        return false;
      }

      return true;
    });

    res.json(courses);
  });

  router.post('/courses/enroll', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const adminCourseId = Number(req.body.adminCourseId);
    const instructor = (req.body.instructor || '').trim();
    const userId = req.session.user.id;
    const db = readDB();

    if (!adminCourseId) {
      return res.status(400).json({ error: 'adminCourseId is required.' });
    }

    const adminCourse = db.adminCourses.find(function (course) {
      return course.id === adminCourseId;
    });

    if (!adminCourse || !adminCourse.enabled) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const existingEnrollment = db.enrollments.find(function (enrollment) {
      return enrollment.userId === userId && enrollment.adminCourseId === adminCourseId;
    });

    if (existingEnrollment) {
      return res.status(409).json({ error: 'You are already enrolled in this course.' });
    }

    const enrollmentId = Date.now();
    const newEnrollment = {
      id: enrollmentId,
      userId: userId,
      adminCourseId: adminCourse.id,
      code: adminCourse.code,
      name: adminCourse.title,
      credits: adminCourse.credits || 0,
      description: adminCourse.description || '',
      term: adminCourse.term,
      instructor: instructor
    };

    db.enrollments.push(newEnrollment);

    const templateAssessments = db.adminCourseAssessments.filter(function (assessment) {
      return assessment.courseId === adminCourse.id;
    });

    templateAssessments.forEach(function (assessment, index) {
      db.assessments.push({
        id: enrollmentId + index + 1,
        userId: userId,
        courseId: enrollmentId,
        title: assessment.title,
        category: assessment.category,
        dueDate: assessment.dueDate || '',
        weight: assessment.weight || 0,
        earned: null,
        total: assessment.total || 100,
        status: 'pending'
      });
    });

    writeDB(db);

    res.status(201).json(buildEnrollmentResponse(db, newEnrollment));
  });

  router.delete('/courses/:courseId', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const courseId = Number(req.params.courseId);
    const userId = req.session.user.id;
    const db = readDB();
    const enrollmentExists = db.enrollments.some(function (enrollment) {
      return enrollment.id === courseId && enrollment.userId === userId;
    });

    if (!enrollmentExists) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    db.enrollments = db.enrollments.filter(function (enrollment) {
      return !(enrollment.id === courseId && enrollment.userId === userId);
    });
    db.assessments = db.assessments.filter(function (assessment) {
      return !(assessment.userId === userId && assessment.courseId === courseId);
    });

    writeDB(db);

    res.json({ success: true });
  });

  router.get('/dashboard', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const userId = req.session.user.id;
    const enrollments = db.enrollments.filter(function (enrollment) {
      return enrollment.userId === userId;
    });
    const courses = enrollments.map(function (enrollment) {
      return buildEnrollmentResponse(db, enrollment);
    });
    const enrollmentById = {};
    const upcomingAssessments = db.assessments
      .filter(function (assessment) {
        return assessment.userId === userId && assessment.status === 'pending';
      })
      .map(function (assessment) {
        if (!enrollmentById[assessment.courseId]) {
          enrollmentById[assessment.courseId] = enrollments.find(function (enrollment) {
            return enrollment.id === assessment.courseId;
          }) || null;
        }

        const course = enrollmentById[assessment.courseId];

        return {
          id: assessment.id,
          courseId: assessment.courseId,
          course: course ? course.code : 'Course',
          courseName: course ? course.name : 'Course',
          title: assessment.title,
          dueDate: assessment.dueDate || '',
          status: assessment.status
        };
      })
      .sort(sortByDueDate);

    res.json({
      courses: courses,
      upcomingAssessments: upcomingAssessments
    });
  });

  return router;
};
