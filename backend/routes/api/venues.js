const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Venue } = require('../../db/models');
const { Group } = require('../../db/models');
const { User } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const { validVenue } = require("../../utils/auth");
const { Membership } = require('../../db/models')

// Edit a Venue by ID
router.put("/:venueId", requireAuth, async (req, res) => {
  const venueId = req.params.venueId;
  const userId = req.user.id;

  const venue = await Venue.findByPk(venueId);
  if (!venue) {
    return res.status(404).json({ message: "Venue couldn't be found" });
  }

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
  if (!isOrganizer && !isCoHost) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await venue.update(req.body);
  const venueEe = venue.toJSON();
  delete venueEe.createdAt;
  delete venueEe.updatedAt;
  res.json(venueEe);
});




module.exports = router;
