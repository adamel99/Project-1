'use strict';
const { Model, Sequelize } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { as: 'Organizer', foreignKey: 'organizerId' });
      Group.hasMany(models.Membership, { foreignKey: 'groupId' });
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId' });
      Group.hasMany(models.Event, { foreignKey: 'groupId' });
      Group.hasMany(models.Venue, { foreignKey: 'groupId' })
    }
  }
  Group.init(
    {
      organizerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Organizer ID is required' },
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Name is required' },
        },
      },
      about: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'About is required' },
        },
      },
      type: {
        type: Sequelize.ENUM('online', 'In person'),
        allowNull: false,
        validate: {
          notNull: { msg: 'Type is required' },
        },
      },
      private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: 'Private is required' },
        },
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'City is required' },
        },
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'State is required' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Group',
    }
  );
  return Group;
};
