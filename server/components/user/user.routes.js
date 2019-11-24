const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const userCtrl = require('./user.controller');

const router = express.Router(); // eslint-disable-line new-cap

const paramValidation = {
  updateUser: {
    body: {
      email: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.number().required()
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },
  updateUserPassword : {
    body: {
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required()
    },
  },
  assignAdmin : {
    body: {
      AdminId: Joi.number().required(),
      ClientId: Joi.number().required()
    },
  }
  
};

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list);

router.route('/profile')
  /** GET /api/users/profile - Get profile of logged in user */
  .get(userCtrl.getProfile);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.destroy);

router.route('/:userId/getAllAdmins')
  .get(userCtrl.getAllAdmins)

router.route('/:userId/getAllClients')
  .get(userCtrl.getAllClients)
  
router.route('/updatePassword/:userId')

  .get(userCtrl.get)

  /** PUT /api/users/updatePassword/:userId - Update user password*/
  .put(validate(paramValidation.updateUserPassword),userCtrl.updatePassword)


/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
