"use strict";
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "EventImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          url: "google.com",
          preview: true,
        },
        {
          eventId: 2,
          url: "bing.com",
          preview: true,
        },
        {
          eventId: 3,
          url: "yahoo.com",
          preview: true,
        },
      ],
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["google.com", "bing.com", "yahoo.com"] },
      },
      {}
    );
  },
};
