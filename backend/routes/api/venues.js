const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Venue } = require('../../db/models');
const { Group } = require('../../db/models');
const { User } = require('../../db/models');
const { GroupImage } = require('../../db/models');

// Edit a Venue by ID
router.put("/:venueId", requireAuth, async (req, res) => {
  const venueId = req.params.venueId;
  const userId = req.user.id;

  const venue = await Venue.findByPk(venueId);
  checkIfExist(venue, "Venue couldn't be found");

  const isOrganizer = await Group.findOne({
    where: { id: venue.groupId, organizerId: userId },
  });
  const isCoHost = await Membership.findOne({
    where: {
      status: "co-host",
      userId,
      groupId: venue.groupId,
    },
  });
  checkAuthorization(isOrganizer || isCoHost);

  await venue.update(validVenue(req.body));
  const venueObj = venue.toJSON();
  delete venueObj.createdAt, delete venueObj.updatedAt;
  res.json(venueObj);
});


module.exports = router;
