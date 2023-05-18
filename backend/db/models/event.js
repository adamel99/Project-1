'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Venue, {foreignKey: 'venueId'})
      Event.belongsTo(models.Group, {foreignKey: 'groupId'})
      Event.hasMany(models.EventImage, {foreignKey: 'eventId'})
      Event.hasMany(models.Attendance, {foreignKey:'eventId'})
    }
  }
  Event.init({
    venueId: {type: DataTypes.INTEGER, allowNull: false},
    groupId: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING,allowNull:false},
    description: {type: DataTypes.TEXT, allowNull: false},
    type: {type: DataTypes.ENUM('online', 'in person'), allowNull: false},
    capacity: {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    startDate: {type:DataTypes.DATE, allowNull: false},
    endDate: {type: DataTypes.DATE, allowNull: false}
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
