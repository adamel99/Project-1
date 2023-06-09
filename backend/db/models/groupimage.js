'use strict';
const {
  Model

} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    static associate(models) {
      GroupImage.belongsTo(models.Group, { foreignKey: 'groupId' })
    }
  }
  GroupImage.init({
    groupId: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    preview: { type: DataTypes.BOOLEAN, allowNull: false }
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
