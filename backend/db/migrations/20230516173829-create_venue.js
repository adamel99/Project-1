'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id:{
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
        allowNull: false
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull: false
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
