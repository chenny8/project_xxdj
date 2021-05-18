'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feiyonghuizongs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channel_no: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      bussiness_type: {
        type: Sequelize.STRING
      },
      cash_type: {
        type: Sequelize.STRING
      },
      is_cmiot: {
        type: Sequelize.STRING
      },
      income: {
        type: Sequelize.STRING
      },
      bussiness_time: {
        type: Sequelize.DATE
      },
      memo: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('feiyonghuizongs');
  }
};