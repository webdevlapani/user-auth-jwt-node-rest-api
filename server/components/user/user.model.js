const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const db = require('../../config/db');
const APIError = require('../../helpers/APIError');
const Op = Sequelize.Op;


/**
 * User Schema
 */
const UserSchema = {
  id: {
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
  role:{
    type: Sequelize.SMALLINT,
    allowNull: false,
  },
  isActive:{
    type: Sequelize.SMALLINT,
    allowNull: false,
    defaultValue : 0
  },
  isDelete:{
    type: Sequelize.SMALLINT,
    allowNull: false,
    defaultValue : 0
  },
  ClientId :{
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
};

const User = db.sequelize.define('user', UserSchema);

/**
 * Statics
 */

/**
 * Get user
 * @param {number} id - The id of user.
 * @returns {Promise<User, APIError>}
 */
User.get = function get(id) {
  return this.findById(id)
    .then((user) => {
      if (user) {
        return user;
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
};


/**
 * List users in order of 'id'.
 * @param {number} skip - Number of users to be skipped.
 * @param {number} limit - Limit number of users to be returned.
 * @returns {Promise<User[]>}
 */
User.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

User.getByEmail = function getByEmail(email) {
  return this.findOne({
    where: {
      email,
    },
  });
};

User.getAllByrole = function getAllByrole(role,ClientId,id) {
  return this.findAll({
    where: {
      role,
      ClientId,
      isActive:1,
      isDelete:0,
      id:{
          [Op.ne] : id
      }
    },
  });
};

User.getAllByroleWithoutClientId = function getAllByroleWithoutClientId(role) {
  return this.findAll({
    where: {
      role,
      isActive:1,
      isDelete:0
    },
  });
};

User.getByEmailAndClientId = function getByEmailAndClientId(email,ClientId){
  return this.findOne({
    where: {
      email,
      ClientId
    },
  });
}

User.getAllUserRolewiseByClientId = function getAllUserRolewiseByClientId(role,ClientId){
  return this.findAll({
    where:{
      role,
      ClientId,
      isActive : 1,
      isDelete:0
    }
  })
}

User.getAllUserByClientId = function getAllUserByClientId(ClientId){
  return this.findAll({
    where :{
      ClientId,
      isActive : 1,
      isDelete:0
    }
  })
}

User.getByEmailRoleAndClientId = function getByEmailRoleAndClientId(email,role,ClientId) {
  return this.findOne({
    where: {
      email,
      role,
      ClientId
    },
  });
};

User.getEmailAndRole = function getEmailAndRole(email,role) {
  return this.findOne({
    where: {
      email,
      role
    },
  });
};
/**
 * Methods
 */

/**
 * Generates password for the plain password.
 * @param password
 * @returns {string} - hashed password
 */
User.prototype.generatePassword = function generatePassword(password) {
  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(password, salt, null);
  return {salt,hashPassword};
};

/**
 * Checks if the password matches the hash of password
 * @param password
 * @returns {boolean} - Returns true if password matches.
 */
User.prototype.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * Generates same model of user details.
 * @returns {object} - Public information of user.
 */
User.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ['password','salt','isActive','isDelete','createdAt','updatedAt']);
};

/**
 * @typedef User
 */
module.exports = User;
