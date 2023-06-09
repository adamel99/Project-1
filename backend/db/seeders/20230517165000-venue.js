"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Venues";
    return queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 1,
          address: "11 street ave",
          city: "Jersey City",
          state: "New Jersey",
          lat: 22.233,
          lng: 23.223
        },
        {
          groupId: 2,
          address: "12 street ave",
          city: "Jersey City",
          state: "New Jersey",
          lat: 23.233,
          lng: 24.223
        },
        {
          groupId: 3,
          address: "13 street ave",
          city: "Jersey City",
          state: "New Jersey",
          lat: 25.233,
          lng: 26.223
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: { [Op.in]: ["11 street ave", "12 street ave", "13 street ave"] },
      },
      {}
    );
  },
};
