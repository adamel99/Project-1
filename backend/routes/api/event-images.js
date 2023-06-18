const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Event } = require('../../db/models');
const { EventImage } = require('../../db/models');
const { Venue } = require('../../db/models');
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const { Membership } = require('../../db/models')
const { GroupImage } = require('../../db/models')

// Delete an image for a EVENT
router.delete("/:imageId", requireAuth, async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    const groupImage = await GroupImage.findByPk(imageId);
    if (!groupImage) {
      return res.status(404).json({ message: "Group Image couldn't be found" });
    }
    const group = await Group.findByPk(groupImage.groupId);
    const isCoHost = await Membership.findOne({
      where: {
        groupId: group.id,
        userId,
        status: "co-host",
      },
    });
    if (!(group.organizerId === userId || isCoHost)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await groupImage.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
