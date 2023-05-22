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
    const { email, password } = req.body;
    console.log(req.body)

    if (!email || !password) {
      res.status(400).json({
        message: 'Bad Request',
        errors: {
          email: 'Email is required',
          password: 'Password is required'
        }
      });
    } else {
      const user = await User.findOne({ where: { email } });
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };
    console.log({ safeUser });

    await setTokenCookie(res, safeUser);

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
      } else {
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


// router.get(
//   '/',
//   (req, res) => {
//     const { user } = req;
//     if (user) {
//       const safeUser = {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//       };
//       return res.json({
//         user: safeUser
//       });
//     } else return res.json({ user: null });
//   }
// );

// router.delete(
//   '/',
//   (_req, res) => {
//     res.clearCookie('token');
//     return res.json({ message: 'success' });
//   }
// );

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
