const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const authCtrl = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  login: {
    body: {
      ClientId: Joi.number().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  registerUser: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      ClientId : Joi.number().required(),
      role : Joi.number().required()
    },
  },
  createNewPassword : {
    body :{ 
      token : Joi.string().required(),
      newPassword: Joi.string().required(),
    },
  },
  createLinkfornewPassword : { 
    body : { 
      email: Joi.string().email().required(),
      ClientId: Joi.number().required(),
      role: Joi.number().required()
    }
  },
  vyakarLogin : {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }
};

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register - Register a new user */
router.route('/register')
  .post(validate(paramValidation.registerUser), authCtrl.register);

router.route('/createNewPassword')
  /** PUT /api/auth/createNewPassword - Create new password for user*/
  .put(validate(paramValidation.createNewPassword),authCtrl.createNewPassword)

router.route('/vyakarLogin')
 /** POST /api/auth/vyakarLogin - Returns token if correct username and password is provided */
  .post(validate(paramValidation.vyakarLogin),authCtrl.vyakarLogin)

router.route('/createLinkfornewPassword')
  /** POST /api/auth/createLinkfornewPassword - Create link new password for user*/
  .post(validate(paramValidation.createLinkfornewPassword),authCtrl.createLinkfornewPassword)

router.route('/createNewPasswordVyakar')
  /** PUT /api/auth/createNewPasswordVyakar - Create new password for vyakar*/
  .put(validate(paramValidation.createNewPassword),authCtrl.createNewPasswordVyakar) 

module.exports = router;
