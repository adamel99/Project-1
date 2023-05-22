"use strict";
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Memberships";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          groupId: 1,
          status: 'member',
          memberId: 4
        },
        {
          userId: 2,
          groupId: 2,
          status: 'member',
          memberId: 1
        },
        {
          userId: 3,
          groupId: 3,
          status: 'host',
          memberId: 2
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        status: { [Op.in]: ["member", "member", "host"] },
      },
      {}
    );
  },
};
