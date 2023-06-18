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
const { Membership } = require('../../db/models');



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
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  try {
    const eventIdentifier = req.params.eventId;
    const userIdentifier = req.user.id;
    const event = await Event.findByPk(eventIdentifier);
    if (!event) {
      throw new Error("Event couldn't be found");
    }
    const isMember = await Membership.findOne({
      where: {
        userId: userIdentifier,
        groupId: event.groupId,
        status: { [Op.not]: "pending" },
      },
    });
    if (!isMember) {
      throw new Error("Unauthorized");
    }
    const attendanceEx = await Attendance.findOne({
      where: {
        userId: userIdentifier,
        eventId: eventIdentifier,
      },
    });
    if (attendanceEx && attendanceEx.status === "pending") {
      return res.status(400).json({ message: "Attendance has already been requested" });
    }
    if (attendanceEx && attendanceEx.status === "attending") {
      return res.status(400).json({ message: "User is already an attendee of the event" });
    }
    const attendance = await Attendance.create({
      status: "pending",
      userId: userIdentifier,
      eventId: eventIdentifier,
    });
    return res.json({
      userIdentifier: attendance.userId,
      status: attendance.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//CHANGE ATTENDANCE STATUS
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const currUserId = req.user.id;
    const { userId, status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ message: "Please provide userId and status" });
    }
    if (status === "pending") {
      return res.status(400).json({ message: "Cannot change an attendance status to pending" });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const group = await Group.findByPk(event.groupId);

    const isCoHost = await Membership.findOne({
      where: {
        userId: currUserId,
        groupId: event.groupId,
        status: "co-host",
      },
    });
    const isOrganizer = currUserId === group.organizerId;
    if (!isCoHost && !isOrganizer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const attendance = await Attendance.findOne({
      where: {
        userId,
        eventId,
      },
      attributes: ["id", "eventId", "userId", "status"],
    });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance between the user and the event does not exist" });
    }

    await attendance.update({ status }, { where: { userId, eventId } });

    res.json({
      id: attendance.id,
      eventId: attendance.eventId,
      userId: attendance.userId,
      status: attendance.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//GET ALL ATTENDEES OF EVENT BY ITS ID
router.get("/:eventId/attendees", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    let userId;
    if (req.user) {
      userId = req.user.id;
    }
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
    const group = await Group.findByPk(event.groupId);
    const isCoHost = await Membership.findOne({
      where: {
        userId,
        groupId: event.groupId,
        status: "co-host",
      },
    });
    const isOrganizer = group.organizerId === userId;
    let where = { eventId };
    if (!(isOrganizer || isCoHost)) {
      where = { status: { [Op.not]: "pending" }, eventId };
    }
    const attendees = await Attendance.findAll({
      where,
      attributes: ["status", "userId"],
    });
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      raw: true,
    });
    const Attendees = attendees.map((attendance) => {
      const user = users.find((user) => user.id === attendance.userId);
      return { userId: user.id, firstName: user.firstName, lastName: user.lastName, Attendance: { status: attendance.status } };
    });
    return res.status(200).json({ Attendees });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
