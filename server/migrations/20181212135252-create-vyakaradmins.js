'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
  queryInterface.createTable('vyakarAdmins', {
    id : {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  firstName: {
      type: Sequelize.STRING,
      allowNull : false
  },
  lastName: {
      type: Sequelize.STRING,
      allowNull : false
  },
  email: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  salt: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  isActive:{
      type: Sequelize.SMALLINT,
      allowNull: false,
      defaultValue : 1
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
  down: queryInterface => queryInterface.dropTable('vyakarAdmins')
};
