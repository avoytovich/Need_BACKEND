'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Need extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Need.hasMany(models.Offer, {
        foreignKey: 'need_id'
      });
      Need.belongsTo(models.User, {
        foreignKey: 'owner_id'
      });
    }
  };
  Need.init({
    title: DataTypes.STRING,
    ability_to_pay: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    owner_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Need'
  });
  return Need;
};
