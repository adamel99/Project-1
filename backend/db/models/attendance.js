'use strict';
const {
  Model

} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Event, { foreignKey: 'eventId' });
      Attendance.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Attendance.init({
    eventId: { type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE" },
    userId: { type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE" },
    status: { type: DataTypes.ENUM('pending', 'waitlist', 'attending'), allowNull: false },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
