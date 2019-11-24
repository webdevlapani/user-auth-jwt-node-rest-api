const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const vyakarCntrl = require('./vyakarAdmin.controller');

const router = express.Router();

const paramValidation = {
    createNewVyakar: {
      body: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
      },
    },
    login: {
      body: {
        email: Joi.string().required(),
        password : Joi.string().required()
      },
    },
    updateVyakar : {
      body: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        id: Joi.number().required(),
      }
    },
    deleteVyakar:{
     params: {
        id: Joi.number().required(),
      }
    },
    updatePassword : {
      body: {
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
      },
    },
    createLinkforNewPassword:{
        body: {
           email:Joi.string().required()
        },
    },
    loginAs : {
        body: {
            email:Joi.string().required()
        },  
    }
};

router.route('/loginAs')
    /** POST /api/secret/vyakarAdmin/loginAs - Login Client Uset/Admin using email */
    .post(validate(paramValidation.loginAs),vyakarCntrl.loginAs)

router.route('/profile')
    /** GET /api/secret/vyakarAdmin/profile - get vyakar admin profile */
    .get(vyakarCntrl.getProfile)

router.route('/createNewVyakar')
    /** POST /api/secret/vyakarAdmin/createNewVyakar - create New vyakar admin */
    .post(validate(paramValidation.createNewVyakar),vyakarCntrl.createNewVyakar)
    
router.route('/updateVyakar')
    /** PUT /api/secret/vyakarAdmin/updateVyakar - Update vyakar admin */
    .put(validate(paramValidation.updateVyakar),vyakarCntrl.updateVyakar)  
    
router.route('/deleteVyakar/:id')
    /** POST /api/secret/vyakarAdmin/deleteVykar - Delete vyakar admin */
    .delete(validate(paramValidation.deleteVyakar),vyakarCntrl.deleteVyakar)

router.route('/getAllClient')
    /** GET /api/secret/vyakarAdmin/getAllClient - getAllClient (get All Company) */
    .get(vyakarCntrl.getAllClient)

router.route('/getAllClientAdmin/:ClientId')
    /** GET /api/secret/vyakarAdmin/getAllClientAdmin/:ClientId - Get all client admin based on company */
    .get(vyakarCntrl.getAllClientAdminByClientId)
  
router.route('/getAllUser/:ClientId')
     /** GET /api/secret/vyakarAdmin/getAllUser/:ClientId - Get all user based on company */
    .get(vyakarCntrl.getAllUserByClientId)   

router.route('/getAllCleintUser/:ClientId')
    /** GET /api/secret/vyakarAdmin/getAllCleintUser/:ClientId - Get all client user based on company */
    .get(vyakarCntrl.getAllClientUserByClientId)

router.route('/getAllClientUser')
    /** GET /api/secret/vyakarAdmin/getAllCleintUser - Get all client user */
    .get(vyakarCntrl.getAllClientUser)

router.route('/getAllClientAdmin')
     /** GET /api/secret/vyakarAdmin/getAllClientAdmin - Get all client admin */
    .get(vyakarCntrl.getAllClientAdmin)

router.route('/getAllVyakar')
   /** GET /api/secret/vyakarAdmin/getAllVyakar - Get all vyakar admins */
    .get(vyakarCntrl.getAllVyakar)

router.route('/updatePassword')
    /** PUT /api/secret/vyakarAdmin/updatePassword - Update Password vyakar admin */
    .put(validate(paramValidation.updatePassword),vyakarCntrl.updatePassword)

router.route('/createLinkforNewPassword')
    /** PUT /api/secret/vyakarAdmin/createLinkforNewPassword - Create reset password link for vyakar */
    .put(validate(paramValidation.createLinkforNewPassword),vyakarCntrl.createLinkfornewPasswordVyakar)

module.exports = router