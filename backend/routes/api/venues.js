const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Venue } = require('../../db/models');
const { Group } = require('../../db/models');
const { User } = require('../../db/models');
const { GroupImage } = require('../../db/models');

// Edit a Venue by ID
router.put('/:venueId', (req, res) => {
  const venueId = req.params.venueId;
  const { address, city, state, lat, lng } = req.body;
  const userId = req.user.id; // Assuming you have middleware to handle authentication and populate req.user with the logged-in user's details

  Venue.findByPk(venueId, { include: Group })
    .then(venue => {
      if (!venue) {
        return res.status(404).json({ message: 'Venue couldn\'t be found' });
      }
      const group = venue.Group;
      if (!group) {
        return res.status(404).json({ message: 'Group couldn\'t be found' });
      }
      const isOrganizer = group.organizerId === userId;
      // const isCoHost = group.getUsers({ where: { id: userId, status: 'co-host' } }).length > 0;
      if (!isOrganizer && !isCoHost) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      venue.update({ address, city, state, lat, lng })
        .then(updatedVenue => {
          res.status(200).json({
            id: updatedVenue.id,
            groupId: updatedVenue.groupId,
            address, city, state, lat, lng
          });
        })
        .catch(err => {
          if (err.name === 'SequelizeValidationError') {
            const errors = {};
            err.errors.forEach(error => {
              errors[error.path] = error.message;
            });
            res.status(400).json({ message: 'Validation error', errors });
          } else {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
          }
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});


module.exports = router;
