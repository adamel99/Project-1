const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Event } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const {Venue} = require('../../db/models');
const {User} = require('../../db/models');
const { Op } = require('sequelize');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models')

// Delete an image for a group
router.delete('/:imageId', async (req, res, next) => {
    try {
      const { imageId } = req.params;


      const image = await GroupImage.findByPk(imageId);

      if (!image) {
        return res.status(404).json({
          message: 'Group Image couldn\'t be found',
        });
      }

  console.log(image.groupId)
      const group = await Group.findByPk(image.groupId);


      if (!group) {
        return res.status(404).json({
          message: 'Group couldn\'t be found',
        });
      }


      const isAuthorized = req.user && (req.user.id === group.organizerId || req.user.id === group.coHostId);

      if (!isAuthorized) {
        return res.status(403).json({
          message: 'Only the organizer or co-host of the group may delete an image',
        });
      }


      await image.destroy();

      res.status(200).json({
        message: 'Successfully deleted',
      });
    } catch (err) {
      next(err);
    }
  });


  module.exports = router;
