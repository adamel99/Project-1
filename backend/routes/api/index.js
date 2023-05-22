// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js')
const eventsRouter = require('./events.js')
const groupimagesRouter = require('./group-images.js')
const eventimagesRouter = require('./event-images.js')
// const membershipsRouter = require('./membership.js')


const { restoreUser } = require("../../utils/auth.js");
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
// const { Group } = require('../../db/models')


// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter)

router.use('/events', eventsRouter);

router.use('/group-images', groupimagesRouter)

router.use('/event-images', eventimagesRouter)

// router.use('/memberships', membershipsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});




router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);



// ...

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;
