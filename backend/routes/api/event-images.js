const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Event } = require('../../db/models');
const { EventImage } = require('../../db/models');
const {Venue} = require('../../db/models');
const {User} = require('../../db/models');
const { Op } = require('sequelize');
const { Membership } = require('../../db/models')

// Delete an image for a EVENT
router.delete('/:imageId', async (req, res, next) => {
    try {
      const { imageId } = req.params;


      const image = await EventImage.findByPk(imageId);

      if (!image) {
        return res.status(404).json({
          message: 'Event Image couldn\'t be found',
        });
      }

  console.log(image.eventId)
      const event = await Event.findByPk(image.eventId);


      if (!event) {
        return res.status(404).json({
          message: 'Event couldn\'t be found',
        });
      }


      const isAuthorized = req.user && (req.user.id === event.organizerId || req.user.id === event.coHostId);

      if (!isAuthorized) {
        return res.status(403).json({
          message: 'Only the organizer or co-host of the event may delete an image',
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
