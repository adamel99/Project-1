// backend/routes/api/session.js
const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];


// Log in
router.post('/', async (req, res, next) => {
  try {
    const { credentials, password } = req.body;
    console.log(req.body);

    if (!credentials || !password) {
      res.status(400).json({
        message: 'Bad Request',
        errors: {
          credentials: 'Credentials (email or username) is required',
          password: 'Password is required'
        }
      });
    } else {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: credentials }, { username: credentials }]
        }
      });

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
      } else {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
        console.log({ safeUser });

        await setTokenCookie(res, safeUser);

        res.status(200).json({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
          }
        });
      }
    }
  } catch (err) {
    next(err);
  }
});


// GET CURRENT USER
router.get('/', (req, res) => {
  if (req.user) {
    // User is logged in
    res.status(200).json({
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        username: req.user.username
      }
    });
  } else {
    // No user logged in
    res.status(200).json({ user: null });
  }
});








module.exports = router;
