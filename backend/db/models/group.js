'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, { foreignKey: 'organizerId' });
      Group.hasMany(models.Membership, { foreignKey: 'groupId' });
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId' });
      Group.hasMany(models.Event, { foreignKey: 'groupId' });
    }
  }
  Group.init({
    organizerId: {type: DataTypes.INTEGER, allowNull: false},
    name: {type:DataTypes.STRING, allowNull: false},
    about: {type: DataTypes.STRING,allowNull: false},
    type: {type: DataTypes.ENUM('online', 'in person'), allowNull: false},
    private:{type: DataTypes.BOOLEAN, allowNull: false},
    city: {type:DataTypes.STRING, allowNull: false},
    state: {type: DataTypes.STRING, allowNull: false}
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
