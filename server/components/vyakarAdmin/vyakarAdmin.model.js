const Sequelize = require('sequelize');
const db = require('../../config/db');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const Op = Sequelize.Op;

const VyakarAdminsSchema = {
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

}


const VyakarAdmins = db.sequelize.define('vyakarAdmins', VyakarAdminsSchema);

VyakarAdmins.getVyakarById = function getVyakarById(id){
   return this.findOne({
        where : {
            id
        }
    })
}

VyakarAdmins.getVyakarByEmail = function getVyakarByEmail(email){
    return this.findOne({
        where :{
            email
        }
    })
}

VyakarAdmins.getVyakarByEmailWithActive = function getVyakarByEmailWithActive(email){
    return this.findOne({
        where :{
            email,
            isActive : 1
        }
    })
}

VyakarAdmins.getAllVyakar = function getAllVyakar(id){
    return this.findAll({
        where:{
            isDelete:0,
            isActive:1,
            id:{
                [Op.ne] : id
            }
        }
    });
}

VyakarAdmins.prototype.generatePassword = function generatePassword(password) {
    const salt = bcrypt.genSaltSync(8);
    const hashPassword = bcrypt.hashSync(password, salt, null);
    return {salt,hashPassword};
  };
  
  /**
   * Checks if the password matches the hash of password
   * @param password
   * @returns {boolean} - Returns true if password matches.
   */
VyakarAdmins.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
};

VyakarAdmins.prototype.safeModel = function safeModel() {
    return _.omit(this.toJSON(), ['password','salt','isActive','isDelete','createdAt','updatedAt']);
};
  
module.exports = VyakarAdmins;