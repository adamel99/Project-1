"use strict";
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Events";
    return queryInterface.bulkInsert(
      options,
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Basketball",
          description: "5 on 5 pickup",
          type: "in person",
          capacity: 10,
          price: 10,
          startDate: "05/10/22",
          endDate: "05/11/22",
          previewImage: 'google.com',
          organizerId: 1
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Soccer",
          description: "5 on 5 pickup",
          type: "in person",
          capacity: 20,
          price: 10,
          startDate: "2022/12/05",
          endDate: "2022/13/05",
          previewImage: 'google.com',
          organizerId: 4
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Yoga",
          description: "Online yoga",
          type: "online",
          capacity: 30,
          price: 10,
          startDate: "2022/14/05",
          endDate: "2022/15/05",
          previewImage: 'google.com',
          organizerId: 2
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Basketball", "Soccer", "Yoga"] },
      },
      {}
    );
  },
};
