'use strict';
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 1,
          name: 'Sample Group 1',
          about: 'This is a sample group 1',
          type: 'Online',
          private: true,
          city: 'Sample City 1',
          state: 'Sample State 1',
        },
        {
          organizerId: 2,
          name: 'Sample Group 2',
          about: 'This is a sample group 2',
          type: 'In person',
          private: true,
          city: 'Sample City 2',
          state: 'Sample State 2',
        },
        {
          organizerId: 3,
          name: 'Sample Group 3',
          about: 'This is a sample group 3',
          type: 'Online',
          private: true,
          city: 'Sample City 3',
          state: 'Sample State 3',
        },
      ],
    );

  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Sample Group 1", "Sample Group 2", "Sample Group 3"] },
      }
    )
  }
};
