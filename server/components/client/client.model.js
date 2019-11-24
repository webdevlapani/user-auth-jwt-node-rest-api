const Sequelize = require('sequelize');
const db = require('../../config/db');

const ClientsSchema = {
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

}

const Clients = db.sequelize.define('clients', ClientsSchema);

Clients.getAllClient = function getAllClient(){
    return this.findAll();
}

Clients.prototype.safeModel = function safeModel() {
    return _.omit(this.toJSON(), ['isDelete','createdAt','updatedAt']);
};

module.exports = Clients;