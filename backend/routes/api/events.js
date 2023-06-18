const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Venue } = require('../../db/models');
const { Group } = require('../../db/models');
const { User } = require('../../db/models');
const { EventImage } = require('../../db/models');
const { Event } = require('../../db/models');
const { ResultWithContextImpl } = require('express-validator/src/chain');
const { Attendance } = require('../../db/models')
const { Op } = require("sequelize");



// ADD IMAGE TO EVENT
router.post('/:eventId/images', async (req, res) => {
  const eventId = req.params.eventId;
  const { url, preview } = req.body;
  const organizerId = req.user.id;
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }
  try {
    const eventImage = await EventImage.create({
      eventId,
      url,
      preview,
    });
    res.status(201).json({
      id: eventImage.id,
      url: eventImage.url,
      preview: eventImage.preview,
    });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', errors: error.errors });
  }
});

//GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: Group, attributes: ["id", "name", "city", "state"] },
        { model: Venue, attributes: ["id", "city", "state"] },
      ],
      attributes: { exclude: ["capacity", "price", "createdAt", "updatedAt"] },
    });

    const eventBlock = [];
    for (const event of events) {
      const eventTt = event.toJSON();
      const attendance = await Attendance.count({
        where: { eventId: event.id, status: "attending" },
      });
      const eventImg = await EventImage.findOne({
        where: { eventId: event.id },
      });
      eventTt.numAttending = attendance;
      eventTt.previewImage = eventImg ? eventImg.url : "no image";
      eventBlock.push(eventTt);
    }

    res.json({ Events: eventBlock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// GET DETAILS OF EVENT BY ID
router.get("/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findOne({
      where: { id: eventId },
      include: [{ model: EventImage, attributes: ["id", "url", "preview"] }],
    });
    if (!event) {
      throw new Error("Event couldn't be found");
    }
    const group = await Group.findOne({
      where: { id: event.groupId },
      attributes: ["id", "name", "private", "city", "state"],
    });
    const venue = await Venue.findOne({
      where: { id: event.venueId },
      attributes: { exclude: ["updatedAt", "createdAt", "groupId"] },
    });
    const attendance = await Attendance.count({
      where: { eventId, status: { [Op.not]: "pending" } },
    });
    const eventObj = event.toJSON();
    eventObj.numAttending = attendance;
    eventObj.Group = group;
    eventObj.Venue = venue;
    res.json(eventObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//EDIT EVENTS
router.put("/:eventId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const venue = await Venue.findByPk(req.body.venueId);
    if (!venue) {
      throw new Error("Venue couldn't be found");
    }
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      throw new Error("Event couldn't be found");
    }
    const isCoHost = await Membership.findOne({
      where: {
        userId,
        status: "co-host",
        groupId: event.groupId,
      },
    });
    const isOrganizer = await Group.findOne({
      where: { organizerId: userId, id: event.groupId },
    });
    console.log({ isOrganizer, isCoHost });
    if (!isOrganizer && !isCoHost) {
      throw new Error("Unauthorized");
    }
    const { title, description, date, time } = req.body;
    await event.update({
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      time: time || event.time,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// REQUEST ATTENDANCE TO EVENT
router.post('/:eventId/attendance', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event couldn\'t be found',
      });
    }
    const isOrganizerOrCoHost = req.user && (req.user.id === event.organizerId || req.user.id === event.coHostId);
    const attendees = await Attendance.findAll({
      where: {
        eventId,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    const filteredAttendees = isOrganizerOrCoHost
      ? attendees
      : attendees.filter((attendee) => attendee.status !== 'pending');
    res.status(200).json({
      Attendees: filteredAttendees.map((attendee) => ({
        id: attendee.User.id,
        firstName: attendee.User.firstName,
        lastName: attendee.User.lastName,
        Attendance: {
          status: attendee.status,
        },
      })),
    });
  } catch (err) {
    next(err);
  }
});

//CHANGE ATTENDANCE STATUS
router.put('/:eventId/attendance', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId, status } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event couldn\'t be found',
      });
    }
    const isOrganizerOrCoHost = req.currentUser && (req.user.id === event.organizerId || req.user.id === event.coHostId);
    const attendance = await Attendance.findOne({
      where: {
        eventId,
        userId,
      },
    });
    if (!attendance) {
      return res.status(404).json({
        message: 'Attendance between the user and the event does not exist',
      });
    }
    if (status === 'pending') {
      return res.status(400).json({
        message: 'Cannot change an attendance status to pending',
      });
    }
    attendance.status = status;
    await attendance.save();
    res.status(200).json({
      id: attendance.id,
      eventId: attendance.eventId,
      userId: attendance.userId,
      status: attendance.status,
    });
  } catch (err) {
    next(err);
  }
});

//GET ALL ATTENDEES OF EVENT BY ITS ID
router.get('/:eventId/attendees', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event couldn\'t be found',
      });
    };
    const isOrganizerOrCoHost = req.user && (req.user.id === event.organizerId || req.user.id === event.coHostId);
    const attendees = await Attendance.findAll({
      where: {
        eventId,
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
    });
    const formattedAttendees = attendees.map((attendance) => ({
      id: attendance.userId,
      firstName: attendance.userId.firstName,
      lastName: attendance.userId.lastName,
      Attendance: {
        status: attendance.status,
      },
    }));
    if (!isOrganizerOrCoHost) {
      const filteredAttendees = formattedAttendees.filter((attendee) => attendee.Attendance.status !== 'pending');
      return res.status(200).json({
        Attendees: filteredAttendees,
      });
    };
    res.status(200).json({
      Attendees: formattedAttendees,
    });
  } catch (err) {
    next(err);
  }
});

//DELETE ATTENDANCE
router.delete('/:eventId/attendance', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event couldn\'t be found',
      });
    }
    const attendance = await Attendance.findOne({
      where: {
        eventId,
        userId,
      },
    });
    if (!attendance) {
      return res.status(404).json({
        message: 'Attendance does not exist for this User',
      });
    }
    const isAuthorized = req.user.id && (req.user.id === attendance.userId || req.user.id === event.organizerId);
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'Only the User or organizer may delete an Attendance',
      });
    }
    await attendance.destroy();
    res.status(200).json({
      message: 'Successfully deleted attendance from event',
    });
  } catch (err) {
    next(err);
  }
});

// DELETE AN EVENT
router.delete('/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event couldn\'t be found',
      });
    }
    const group = await Group.findByPk(event.groupId);
    if (!group) {
      return res.status(404).json({
        message: 'Group couldn\'t be found',
      });
    }
    const isAuthorized = req.user && (req.user.id === group.organizerId || req.user.id === group.coHostId);
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'Only the organizer or a co-host of the group may delete an event',
      });
    }
    await event.destroy();
    res.status(200).json({
      message: 'Successfully deleted',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
