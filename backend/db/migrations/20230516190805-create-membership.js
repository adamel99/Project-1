'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        references: {model: 'Users', key: 'id'},
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE"
      },
      groupId: {
        references: {model: 'Groups', key: 'id'},
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE"
      },
      status: {
        type: Sequelize.ENUM('pending', 'member', 'co-host', 'host'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Memberships');
  }
};
