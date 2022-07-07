'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Need, {
        foreignKey: 'owner_id'
      });
      User.hasMany(models.Offer, {
        foreignKey: 'owner_id'
      });
    }
  };
  User.init({
    isAdmin: DataTypes.BOOLEAN,
    isActivate: DataTypes.BOOLEAN,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photo: DataTypes.BLOB,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};