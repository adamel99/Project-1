"use strict";


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "EventImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          url: "https://thumbs.dreamstime.com/z/basketball-scoring-points-action-photo-going-basket-live-game-37043542.jpg?w=992",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://thumbs.dreamstime.com/z/kids-soccer-team-huddle-football-80539013.jpg?w=992",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://thumbs.dreamstime.com/z/old-couple-relaxing-sitting-lotus-pose-senior-men-elderly-women-meditating-sitting-lotus-position-park-125354602.jpg?w=992",
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
