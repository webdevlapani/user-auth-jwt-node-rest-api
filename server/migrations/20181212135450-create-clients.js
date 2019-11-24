'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
  queryInterface.createTable('clients', {
    id : {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  clientName : {
      type: Sequelize.STRING,
      allowNull : false
  },
  isDelete:{
      type: Sequelize.SMALLINT,
      allowNull: false,
      defaultValue : 0
  },
  createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
  },
  updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
  }, 
  }),
  down: queryInterface => queryInterface.dropTable('clients')
};
