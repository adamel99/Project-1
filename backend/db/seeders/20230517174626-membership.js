"use strict";


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
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

        },
        {
          userId: 2,
          groupId: 2,
          status: 'member',

        },
        {
          userId: 3,
          groupId: 3,
          status: 'host',

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
