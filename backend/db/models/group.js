'use strict';
const { Model, Sequelize } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { as: 'Organizer', foreignKey: 'userId' });
      Group.hasMany(models.Membership, { foreignKey: 'groupId' });
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId' });
      Group.hasMany(models.Event, { foreignKey: 'groupId' });
      Group.hasMany(models.Venue, { foreignKey: 'groupId' })
    }
  }
  Group.init(
    {
      organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Organizer ID is required' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Name is required' },
        },
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'About is required' },
        },
      },
      type: {
        type: DataTypes.ENUM('Online', 'In person'),
        allowNull: false,
        validate: {
          notNull: { msg: 'Type is required' },
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: 'Private is required' },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'City is required' },
        },
      },
      state: {
        type: DataTypes.STRING,
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
