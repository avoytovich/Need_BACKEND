'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      need_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Needs',
          key: 'id'
        }
      },
      offer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Offers',
          key: 'id'
        }
      },
      messeges: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Chats');
  }
};
