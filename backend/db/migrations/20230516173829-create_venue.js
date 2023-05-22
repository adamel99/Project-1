'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id:{
        allowNull: false,
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      groupId:{
        type:Sequelize.INTEGER,
        allowNull: false
      },
      address:{
        type:Sequelize.STRING,
        allowNull: false
      },
      city:{
        type:Sequelize.STRING,
        allowNull: false
      },
      state:{
        type:Sequelize.STRING,
        allowNull: false
      },
      lat:{
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      lng:{
        type:Sequelize.DECIMAL,
        allowNull: false
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Venues')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
