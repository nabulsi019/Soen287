const express = require('express');

const authMiddleware = require('../middleware/auth');

function buildCourseResponse(db, course) {
  return Object.assign({}, course, {
    assessmentTemplates: db.adminCourseAssessments.filter(function (template) {
      return template.courseId === course.id;
    })
  });
}

function parseNonNegativeNumber(value, fieldName) {
  const numberValue = Number(value);

  if (value === '' || value === null || value === undefined || Number.isNaN(numberValue) || numberValue < 0) {
    return { error: fieldName + ' must be a non-negative number.' };
  }

  return { value: numberValue };
}

function parsePositiveNumber(value, fieldName) {
  const numberValue = Number(value);

  if (value === '' || value === null || value === undefined || Number.isNaN(numberValue) || numberValue <= 0) {
    return { error: fieldName + ' must be greater than 0.' };
  }

  return { value: numberValue };
}

function createTemplateId(courseId, index) {
  return Date.now() + courseId + index + 1;
}

module.exports = function createAdminRoutes(dbHelpers) {
  const router = express.Router();
  const readDB = dbHelpers.readDB;
  const writeDB = dbHelpers.writeDB;

  router.get('/admin/courses', authMiddleware.requireLogin, authMiddleware.requireAdmin, function (req, res) {
    const db = readDB();
    const courses = db.adminCourses.map(function (course) {
      return buildCourseResponse(db, course);
    });

    res.json(courses);
  });

  router.post('/admin/courses', authMiddleware.requireLogin, authMiddleware.requireAdmin, function (req, res) {
    const code = (req.body.code || '').trim();
    const title = (req.body.title || '').trim();
    const term = (req.body.term || '').trim();
    const description = (req.body.description || '').trim();
    const creditsResult = parseNonNegativeNumber(req.body.credits, 'credits');
    const db = readDB();
    const newCourse = {
      id: Date.now(),
      code: code,
      title: title,
      credits: creditsResult.value,
      term: term,
      description: description,
      enabled: true
    };

    if (!code || !title || !term || !description) {
      return res.status(400).json({ error: 'code, title, credits, term, and description are required.' });
    }

    if (creditsResult.error) {
      return res.status(400).json({ error: creditsResult.error });
    }

    db.adminCourses.push(newCourse);
    writeDB(db);

    res.status(201).json(newCourse);
  });

  router.put('/admin/courses/:id', authMiddleware.requireLogin, authMiddleware.requireAdmin, function (req, res) {
    const courseId = Number(req.params.id);
    const code = (req.body.code || '').trim();
    const title = (req.body.title || '').trim();
    const term = (req.body.term || '').trim();
    const description = (req.body.description || '').trim();
    const creditsResult = parseNonNegativeNumber(req.body.credits, 'credits');
    const templatesPayload = Array.isArray(req.body.assessmentTemplates) ? req.body.assessmentTemplates : null;
    const db = readDB();
    const courseIndex = db.adminCourses.findIndex(function (course) {
      return course.id === courseId;
    });
    const existingTemplates = db.adminCourseAssessments.filter(function (template) {
      return template.courseId === courseId;
    });
    let nextTemplates;

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    if (!code || !title || !term || !description) {
      return res.status(400).json({ error: 'code, title, credits, term, and description are required.' });
    }

    if (creditsResult.error) {
      return res.status(400).json({ error: creditsResult.error });
    }

    db.adminCourses[courseIndex] = Object.assign({}, db.adminCourses[courseIndex], {
      code: code,
      title: title,
      credits: creditsResult.value,
      term: term,
      description: description,
      enabled: typeof req.body.enabled === 'boolean' ? req.body.enabled : !!db.adminCourses[courseIndex].enabled
    });

    if (templatesPayload) {
      nextTemplates = [];

      for (let i = 0; i < templatesPayload.length; i += 1) {
        const template = templatesPayload[i];
        const existingTemplate = existingTemplates.find(function (item) {
          return item.id === Number(template.id);
        }) || null;
        const category = (template.category || '').trim();
        const templateTitle = (template.title || '').trim();
        const weightResult = parseNonNegativeNumber(template.weight === undefined ? 0 : template.weight, 'weight');
        const totalResult = parsePositiveNumber(template.total === undefined ? 100 : template.total, 'total');

        if (!category || !templateTitle) {
          return res.status(400).json({ error: 'Each assessment template needs a category and title.' });
        }

        if (weightResult.error) {
          return res.status(400).json({ error: weightResult.error });
        }

        if (totalResult.error) {
          return res.status(400).json({ error: totalResult.error });
        }

        nextTemplates.push({
          id: existingTemplate ? existingTemplate.id : createTemplateId(courseId, i),
          courseId: courseId,
          category: category,
          title: templateTitle,
          weight: weightResult.value,
          total: totalResult.value,
          dueDate: template.dueDate !== undefined ? String(template.dueDate).trim() : (existingTemplate ? existingTemplate.dueDate || '' : '')
        });
      }

      db.adminCourseAssessments = db.adminCourseAssessments.filter(function (template) {
        return template.courseId !== courseId;
      }).concat(nextTemplates);
    }

    writeDB(db);

    res.json(buildCourseResponse(db, db.adminCourses[courseIndex]));
  });

  router.patch('/admin/courses/:id/toggle', authMiddleware.requireLogin, authMiddleware.requireAdmin, function (req, res) {
    const courseId = Number(req.params.id);
    const db = readDB();
    const course = db.adminCourses.find(function (item) {
      return item.id === courseId;
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    if (typeof req.body.enabled === 'boolean') {
      course.enabled = req.body.enabled;
    } else {
      course.enabled = !course.enabled;
    }

    writeDB(db);

    res.json(course);
  });

  router.delete('/admin/courses/:id', authMiddleware.requireLogin, authMiddleware.requireAdmin, function (req, res) {
    const courseId = Number(req.params.id);
    const db = readDB();
    const courseExists = db.adminCourses.some(function (course) {
      return course.id === courseId;
    });
    const deletedEnrollmentIds = db.enrollments
      .filter(function (enrollment) {
        return enrollment.adminCourseId === courseId;
      })
      .map(function (enrollment) {
        return enrollment.id;
      });

    if (!courseExists) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    db.adminCourses = db.adminCourses.filter(function (course) {
      return course.id !== courseId;
    });
    db.adminCourseAssessments = db.adminCourseAssessments.filter(function (template) {
      return template.courseId !== courseId;
    });
    db.enrollments = db.enrollments.filter(function (enrollment) {
      return enrollment.adminCourseId !== courseId;
    });
    db.assessments = db.assessments.filter(function (assessment) {
      return deletedEnrollmentIds.indexOf(assessment.courseId) === -1;
    });

    writeDB(db);

    res.json({ success: true });
  });

  router.get('/admin/stats', authMiddleware.requireLogin, authMiddleware.requireAdmin, function (req, res) {
    const db = readDB();
    const totalStudents = db.users.filter(function (user) {
      return user.role === 'student';
    }).length;
    const courses = db.adminCourses.map(function (course) {
      return {
        id: course.id,
        code: course.code,
        title: course.title,
        term: course.term,
        enrolledCount: db.enrollments.filter(function (enrollment) {
          return enrollment.adminCourseId === course.id;
        }).length
      };
    });

    res.json({
      totalStudents: totalStudents,
      courses: courses
    });
  });

  return router;
};
