"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
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
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Soccer",
          description: "5 on 5 pickup",
          type: "in person",
          capacity: 20,
          price: 10,
          startDate: "05/12/22",
          endDate: "05/13/22",
          previewImage: 'google.com',
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Yoga",
          description: "Online yoga",
          type: "online",
          capacity: 30,
          price: 10,
          startDate: "05/14/22",
          endDate: "05/15/22",
          previewImage: 'google.com',
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
