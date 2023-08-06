"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "GroupImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 1,
          url: "https://thumbs.dreamstime.com/z/basketball-awards-5220531.jpg?w=768",
          preview: true
        },
        {
          groupId: 2,
          url: "https://thumbs.dreamstime.com/z/kids-celebrating-soccer-victory-young-football-players-holding-trophy-boys-sports-championship-winning-team-sport-tournament-114775165.jpg?w=992",
          preview: true
        },
        {
          groupId: 3,
          url: "https://thumbs.dreamstime.com/z/senior-group-friends-exercise-relax-concept-96004117.jpg?w=992",
          preview: true
        },
      ],
    );
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["https://live.staticflickr.com/7142/6595061455_295d371f97_b.jpg", "https://live.staticflickr.com/7142/6595061455_295d371f97_b.jpg", "https://live.staticflickr.com/7142/6595061455_295d371f97_b.jpg"] },
      },
    );
  },
};
