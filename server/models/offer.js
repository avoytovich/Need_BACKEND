'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Offer.belongsTo(models.User, {
        foreignKey: 'owner_id'
      });
      Offer.belongsTo(models.Need, {
        foreignKey: 'need_id'
      });
    }
  };
  Offer.init({
    description: DataTypes.STRING,
    isAccepted: DataTypes.BOOLEAN,
    owner_id: DataTypes.INTEGER,
    need_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};