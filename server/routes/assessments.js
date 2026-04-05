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

function normalizeNumber(value, fieldName) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return { error: fieldName + ' must be a number.' };
  }

  return numberValue;
}

module.exports = function createAssessmentRoutes(dbHelpers) {
  const router = express.Router();
  const readDB = dbHelpers.readDB;
  const writeDB = dbHelpers.writeDB;

  router.get('/assessments', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const userId = req.session.user.id;
    const courseId = req.query.courseId ? Number(req.query.courseId) : null;
    const assessments = db.assessments.filter(function (assessment) {
      if (assessment.userId !== userId) {
        return false;
      }

      if (courseId && assessment.courseId !== courseId) {
        return false;
      }

      return true;
    });

    res.json(assessments);
  });

  router.post('/assessments', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const userId = req.session.user.id;
    const courseId = Number(req.body.courseId);
    const title = (req.body.title || '').trim();
    const category = (req.body.category || '').trim();
    const dueDate = (req.body.dueDate || '').trim();
    const weightValue = normalizeNumber(req.body.weight, 'weight');
    const totalValue = normalizeNumber(req.body.total, 'total');

    if (!courseId || !title || !category || !dueDate) {
      return res.status(400).json({ error: 'courseId, title, category, and dueDate are required.' });
    }

    if (weightValue && weightValue.error) {
      return res.status(400).json({ error: weightValue.error });
    }

    if (totalValue && totalValue.error) {
      return res.status(400).json({ error: totalValue.error });
    }

    if (weightValue !== null && weightValue < 0) {
      return res.status(400).json({ error: 'weight cannot be negative.' });
    }

    if (totalValue !== null && totalValue <= 0) {
      return res.status(400).json({ error: 'total must be greater than 0.' });
    }

    const enrollment = db.enrollments.find(function (item) {
      return item.id === courseId && item.userId === userId;
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const newAssessment = {
      id: Date.now(),
      userId: userId,
      courseId: courseId,
      title: title,
      category: category,
      dueDate: dueDate,
      weight: weightValue === null ? 0 : weightValue,
      earned: null,
      total: totalValue === null ? 100 : totalValue,
      status: 'pending'
    };

    db.assessments.push(newAssessment);
    writeDB(db);

    res.status(201).json(newAssessment);
  });

  router.put('/assessments/:id', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const userId = req.session.user.id;
    const assessmentId = Number(req.params.id);
    const assessment = db.assessments.find(function (item) {
      return item.id === assessmentId && item.userId === userId;
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    const updatedAssessment = Object.assign({}, assessment);

    if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
      const title = (req.body.title || '').trim();
      if (!title) {
        return res.status(400).json({ error: 'title is required.' });
      }
      updatedAssessment.title = title;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'category')) {
      const category = (req.body.category || '').trim();
      if (!category) {
        return res.status(400).json({ error: 'category is required.' });
      }
      updatedAssessment.category = category;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'dueDate')) {
      updatedAssessment.dueDate = (req.body.dueDate || '').trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'weight')) {
      const weightValue = normalizeNumber(req.body.weight, 'weight');
      if (weightValue && weightValue.error) {
        return res.status(400).json({ error: weightValue.error });
      }
      if (weightValue !== null && weightValue < 0) {
        return res.status(400).json({ error: 'weight cannot be negative.' });
      }
      updatedAssessment.weight = weightValue;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'total')) {
      const totalValue = normalizeNumber(req.body.total, 'total');
      if (totalValue && totalValue.error) {
        return res.status(400).json({ error: totalValue.error });
      }
      if (totalValue !== null && totalValue <= 0) {
        return res.status(400).json({ error: 'total must be greater than 0.' });
      }
      updatedAssessment.total = totalValue;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'earned')) {
      const earnedValue = normalizeNumber(req.body.earned, 'earned');
      if (earnedValue && earnedValue.error) {
        return res.status(400).json({ error: earnedValue.error });
      }
      if (earnedValue !== null && earnedValue < 0) {
        return res.status(400).json({ error: 'earned cannot be negative.' });
      }
      updatedAssessment.earned = earnedValue;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
      const status = (req.body.status || '').trim();
      if (status !== 'pending' && status !== 'completed') {
        return res.status(400).json({ error: 'status must be pending or completed.' });
      }
      updatedAssessment.status = status;
    }

    if (updatedAssessment.total === null && updatedAssessment.earned !== null) {
      return res.status(400).json({ error: 'total must be set when earned marks are provided.' });
    }

    if (updatedAssessment.total !== null && updatedAssessment.earned !== null &&
        Number(updatedAssessment.earned) > Number(updatedAssessment.total)) {
      return res.status(400).json({ error: 'earned cannot exceed total.' });
    }

    const assessmentIndex = db.assessments.findIndex(function (item) {
      return item.id === assessmentId && item.userId === userId;
    });

    db.assessments[assessmentIndex] = updatedAssessment;
    writeDB(db);

    const courseAssessments = db.assessments.filter(function (item) {
      return item.userId === userId && item.courseId === updatedAssessment.courseId;
    });

    res.json({
      assessment: updatedAssessment,
      currentAverage: calculateCourseAverage(courseAssessments)
    });
  });

  router.delete('/assessments/:id', authMiddleware.requireLogin, requireStudent, function (req, res) {
    const db = readDB();
    const userId = req.session.user.id;
    const assessmentId = Number(req.params.id);
    const assessmentExists = db.assessments.some(function (item) {
      return item.id === assessmentId && item.userId === userId;
    });

    if (!assessmentExists) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    db.assessments = db.assessments.filter(function (item) {
      return !(item.id === assessmentId && item.userId === userId);
    });
    writeDB(db);

    res.json({ success: true });
  });

  return router;
};
