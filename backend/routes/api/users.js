// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];



// Sign up
router.post("/", validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
    });
    console.log({ firstName, lastName, user });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };
    // console.log({ safeUser });

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser,
    });
});


// router.post(
//     '/',
//     async (req, res) => {
//         const { email, password, username, firstName, lastName } = req.body;
//         const hashedPassword = bcrypt.hashSync(password);
//         const user = await User.create({ email, username, hashedPassword, firstName, lastName });

//         const safeUser = {
//             id: user.id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             username: user.username,
//         };

//         await setTokenCookie(res, safeUser);

//         return res.json({
//             user: safeUser
//         });
//     }
// );

// router.post('/', async (req, res, next) => {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         res.status(400).json({
//           message: 'Bad Request',
//           errors: {
//             email: 'Email is required',
//             password: 'Password is required'
//           }
//         });
//       } else {
//         const user = await User.findOne({ where: { email } });

//         if (!user || !user.validatePassword(password)) {
//           res.status(401).json({ message: 'Invalid credentials' });
//         } else {
//           res.status(200).json({
//             user: {
//               id: user.id,
//               firstName: user.firstName,
//               lastName: user.lastName,
//               email: user.email,
//               username: user.username
//             }
//           });
//         }
//       }
//     } catch (err) {
//       next(err);
//     }
//   });



module.exports = router;
