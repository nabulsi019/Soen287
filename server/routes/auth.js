const express = require('express');
const bcrypt = require('bcryptjs');

function getSafeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  };
}

module.exports = function createAuthRoutes(dbHelpers) {
  const router = express.Router();
  const readDB = dbHelpers.readDB;
  const writeDB = dbHelpers.writeDB;

  router.get('/me', function (req, res) {
    if (!req.session || !req.session.user) {
      return res.json({
        loggedIn: false,
        user: null
      });
    }

    return res.json({
      loggedIn: true,
      user: req.session.user
    });
  });

  router.post('/register', function (req, res) {
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const db = readDB();
    const duplicateUser = db.users.find(function (user) {
      return user.email === email;
    });

    if (duplicateUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const newUser = {
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: 'student'
    };

    db.users.push(newUser);
    writeDB(db);

    req.session.user = getSafeUser(newUser);

    return res.status(201).json({
      success: true,
      user: req.session.user
    });
  });

  router.post('/login', function (req, res) {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = readDB();
    const user = db.users.find(function (dbUser) {
      return dbUser.email === email;
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.user = getSafeUser(user);

    return res.json({
      success: true,
      user: req.session.user
    });
  });

  router.post('/logout', function (req, res) {
    req.session.destroy(function (error) {
      if (error) {
        return res.status(500).json({ error: 'Logout failed. Please try again.' });
      }

      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  return router;
};
