const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth')
const { Event } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const { Venue } = require('../../db/models');
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { EventImage } = require('../../db/models');
const { Attendance } = require('../../db/models');



// Get all Groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    raw: true,
  });
  for (let group of groups) {
    const numMembers = await Membership.count({
      where: {
        groupId: group.id,
        status: {
          [Op.not]: "pending",
        },
      },
    });
    const previewImage = await GroupImage.findOne({
      where: {
        groupId: group.id,
        preview: true,
      },
    });
    group.numMembers = numMembers;
    group.previewImage = previewImage ? previewImage.url : null;
  }
  res.json({
    Groups: groups,
  });
});


// Get all Groups joined or organized by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const groups = await Group.findAll({
    where: { organizerId: req.user.id },
    raw: true,
  });
  for (let group of groups) {
    const numMembers = await Membership.count({
      where: {
        groupId: group.id,
        status: {
          [Op.not]: "pending",
        },
      },
    });
    const previewImage = await GroupImage.findOne({
      where: {
        groupId: group.id,
        preview: true,
      },
    });
    group.numMembers = numMembers;
    group.previewImage = previewImage ? previewImage.url : null;
  }
  res.json({
    Groups: groups,
  });
});

// // Get details of a Group from an id
router.get('/:groupId', async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId, {
    include: [
      { model: GroupImage, attributes: ['id', 'url', 'preview'] },
      {
        model: User,
        as: "Organizer",
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt", "username"],
        },
      },
      { model: Venue, attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'] },
    ],
  });
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const numMembers = await Membership.count({ where: { groupId } });

  const groupProj = group.toJSON();
  groupProj.numMembers = numMembers;

  res.status(200).json(groupProj);
});


// Create a Group
router.post("/", requireAuth, async (req, res) => {
  const newGroup = await Group.create({
    organizerId: req.user.id,
    ...req.body,
  });

  res.status(201).json(newGroup);
});


// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', async (req, res) => {
  const groupId = req.params.groupId;
  const { url, preview } = req.body;
  const organizerId = req.user.id;
  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  if (group.organizerId !== organizerId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const groupImage = await GroupImage.create({
      groupId,
      url,
      preview,
    });
    res.status(201).json({
      id: groupImage.id,
      url: groupImage.url,
      preview: groupImage.preview,
    });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', errors: error.errors });
  }
});

// // Edit a Group
router.put('/:groupId', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const { name, about, type, private, city, state } = req.body;
  const organizerId = req.user.id;
  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  if (group.organizerId !== organizerId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    group.name = name;
    group.about = about;
    group.type = type;
    group.private = private;
    group.city = city;
    group.state = state;
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', errors: error.errors });
  }
});




// // GET /api/groups/:groupId/venues
router.get('/:groupId/venues', (req, res) => {
  const groupId = req.params.groupId;
  Group.findByPk(groupId)
    .then(group => {
      if (!group) {
        return res.status(404).json({ message: 'Group couldn\'t be found' });
      }
      group.getVenues()
        .then(venues => {
          res.status(200).json({ Venues: venues });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// // POST /api/groups/:groupId/venues
router.post('/:groupId/venues', (req, res) => {
  const groupId = req.params.groupId;
  const { address, city, state, lat, lng } = req.body;
  const userId = req.user.id; // Assuming you have middleware to handle authentication and populate req.user with the logged-in user's details

  Group.findOne({ where: { id: groupId } })
    .then(group => {
      if (!group) {
        return res.status(404).json({ message: 'Group couldn\'t be found' });
      }
      const isOrganizer = group.organizerId === userId;
      // const isCoHost = group.getUsers({ where: { id: userId, status: 'co-host' } }).length > 0;

      if (!isOrganizer && !isCoHost) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      Venue.create({ groupId, address, city, state, lat, lng })
        .then(venue => {
          res.status(200).json(venue);
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

// // PUT /api/venues/:venueId
router.put('/venues/:venueId', (req, res) => {
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
      const isCoHost = group.getUsers({ where: { id: userId, status: 'co-host' } }).length > 0;

      if (!isOrganizer && !isCoHost) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      venue.update({ address, city, state, lat, lng })
        .then(updatedVenue => {
          res.status(200).json(updatedVenue);
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

// CREATE EVENT FOR A GROUP BY ID
router.post('/:groupId/events', (req, res) => {
  const groupId = req.params.groupId;
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
  const userId = req.user.id;

  Group.findOne({ where: { id: groupId } })
    .then(group => {
      if (!group) {
        return res.status(404).json({ message: 'Group couldn\'t be found' });
      }

      const isOrganizer = group.organizerId === userId;
      console.log(isOrganizer)
      if (!isOrganizer) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      Event.create({ groupId, venueId, name, type, capacity, price, description, startDate, endDate })
        .then(event => {
          res.status(200).json(event);
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
            res.status(501).json({ message: 'Internal Server Error' });
          }
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});


//GET ALL EVENTS
router.get("/:groupId/events", async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        groupId: req.params.groupId,
      },
      include: [
        { model: Group, attributes: ["id", "name", "city", "state"] },
        { model: Venue, attributes: ["id", "city", "state"] },
      ],
      attributes: {
        exclude: ["capacity", "price", "createdAt", "updatedAt", "description"],
        include: ["groupId"],
      },
    });
    if (events.length === 0) {
      throw new Error("No events found.");
    }
    const eventArr = await Promise.all(
      events.map(async (event) => {
        const eventObj = event.toJSON();
        const attendance = await Attendance.count({
          where: {
            eventId: event.id,
            status: "attending",
          },
        });
        const eventImage = await EventImage.findOne({
          where: {
            eventId: event.id,
          },
        });
        eventObj.numAttending = attendance;
        eventObj.previewImage = eventImage;
        return eventObj;
      })
    );
    res.json({ Events: eventArr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//REQUEST MEMBERSHIP TO A GROUP
router.post('/:groupId/membership', async (req, res, next) => {
  try {
    console.log(req.user.id)
    const userId = req.user.id;
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({
        message: 'Group could not be found',
      });
    }
    const existingRequest = await Membership.findOne({
      where: {
        groupId,
        userId,
        status: 'pending',
      },
    });
    if (existingRequest) {
      return res.status(400).json({
        message: 'Membership has already been requested',
      });
    }
    const existingMembership = await Membership.findOne({
      where: {
        groupId,
        userId,
        status: 'member',
      },
    });
    if (existingMembership) {
      return res.status(400).json({
        message: 'User is already a member of the group',
      });
    }
    const newMembership = await Membership.create({
      groupId,
      userId,
      status: 'pending',
    });

    res.status(200).json({
      memberId: newMembership.userId,
      status: newMembership.status,
    });
  } catch (err) {
    next(err);
  }
});

// CHANGE MEMBERSHIP STATUS
router.put("/:groupId/membership", requireAuth, async (req, res) => {
  try {
    const { memberId, status } = req.body;
    if (!memberId || !status) {
      return res.status(400).json({ message: "Body not provided" });
    }
    if (status === "pending") {
      return res.status(400).json({
        message: "Validation Error",
        errors: {
          status: "Cannot change a membership status to pending",
        },
      });
    }
    const existingUser = await User.findOne({
      where: { id: memberId },
    });
    if (!existingUser) {
      return res.status(400).json({
        message: "Validation Error",
        errors: {
          memberId: "User couldn't be found",
        },
      });
    }
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new Error("Group couldn't be found");
    }
    const userId = req.user.id;
    const member = await Membership.findOne({
      where: {
        userId: memberId,
        groupId,
      },
    });
    if (!member) {
      throw new Error("Membership between the user and the group does not exist");
    }
    const isCoHost = await Membership.findOne({
      where: { userId, groupId, status: "co-host" },
    });
    const isOrganizer = group.organizerId === userId;
    if (!(isCoHost || isOrganizer)) {
      throw new Error("Unauthorized");
    }
    if (status === "co-host" && !isOrganizer) {
      throw new Error("Unauthorized");
    }
    await member.update({ status });
    await member.reload({ attributes: { include: ["id"] } });
    const memberRr = member.toJSON();
    delete memberRr.createdAt;
    delete memberRr.updatedAt;

    res.json({ id: member.id, ...memberRr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all members of a group specified by its id
router.get('/:groupId/membership', async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        message: 'Group couldn\'t be found',
      });
    }
    const isOrganizerOrCoHost = req.currentUser && (req.currentUser.id === group.organizerId || req.currentUser.id === group.coHostId);
    const members = await Membership.findAll({
      where: {
        groupId,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    const filteredMembers = isOrganizerOrCoHost
      ? members
      : members.filter((member) => member.status !== 'pending');
    res.status(200).json({
      Members: filteredMembers.map((member) => ({
        id: member.User.id,
        firstName: member.User.firstName,
        lastName: member.User.lastName,
        Membership: {
          status: member.status,
        },
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Delete membership to a group specified by its ID
router.delete('/:groupId/membership', async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        message: 'Group couldn\'t be found',
      });
    }
    const user = await User.findByPk(memberId);
    if (!user) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: {
          memberId: 'User couldn\'t be found',
        },
      });
    }
    const membership = await Membership.findOne({
      where: {
        groupId,
        userId: memberId,
      },
    });
    if (!membership) {
      return res.status(404).json({
        message: 'Membership does not exist for this User',
      });
    }
    const isAuthorized = req.user && (req.user.id === membership.userId || req.user.id === group.organizerId);
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'Only the User or organizer may delete a Membership',
      });
    }
    await membership.destroy();
    res.status(200).json({
      message: 'Successfully deleted membership from group',
    });
  } catch (err) {
    next(err);
  }
});

// Delete a group
router.delete("/:groupId", async (req, res) => {
  try {
    const userId = req.user.id;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (group.organizerId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await group.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
