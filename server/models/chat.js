'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.Need, {
        foreignKey: 'need_id',
        onDelete: 'CASCADE'
      });
      Chat.belongsTo(models.Offer, {
        foreignKey: 'offer_id',
        onDelete: 'CASCADE'
      });
    }
  };
  Chat.init({
    need_id: DataTypes.INTEGER,
    offer_id: DataTypes.INTEGER,
    messeges: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Chat'
  });
  return Chat;
};
