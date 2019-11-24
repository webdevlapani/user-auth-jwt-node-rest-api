const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../user/user.model');
const APIError = require('../../helpers/APIError');
const config = require('../../config');
const commonHelpere = require('../../helpers/commonHelper');
const nodemailer = require('nodemailer');
const VyakarAdmins = require('..//vyakarAdmin/vyakarAdmin.model');


/**
 * Returns jwt token and user details if valid email and password are provided
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @returns {token, User}
 */
function login(req, res, next) {
  User.getByEmailAndClientId(req.body.email,req.body.ClientId)
    .then((foundUser) => {
      if (!foundUser) {
        const err = new APIError('User not found', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
      if(foundUser.isActive === 0){
        const err = new APIError('User not verified', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
      if (!foundUser.validPassword(req.body.password)) {
        const err = new APIError('Email or Password wrong', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
      const token = jwt.sign(foundUser.safeModel(), config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });
      return res.json({
        token,
        user: foundUser.safeModel(),
      });
    })
    .catch(err => next(new APIError(err.message, httpStatus.NOT_FOUND)));
}

/**
 * Register a new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
function register(req, res, next) {
  const user = new User(req.body);
  User.getByEmailAndClientId(req.body.email,req.body.ClientId)
    .then((foundUser) => {
      if (foundUser) {
        return Promise.reject(new APIError('User already exist!', httpStatus.CONFLICT, true));
      }
      user.password = 'WrongPassword';
      user.salt = 'WrongPassword';
      return user.save();
    })
    .then((savedUser) => {
      const token = commonHelpere.encryptedString(JSON.stringify( { id : savedUser.safeModel().id } ));
      sendMail(req,'Verify your account',token,"user");
      return res.json({
          success:'Mail Sent'
       });
    })
    .catch(e => next(e));
}

function createLinkfornewPassword(req,res,next){
  User.getByEmailRoleAndClientId(req.body.email,req.body.role,req.body.ClientId)
    .then((foundUser) => {
      if (!foundUser) {
        return Promise.reject(new APIError('User not found', httpStatus.CONFLICT, true));
      }
      const token = commonHelpere.encryptedString(JSON.stringify( { id : foundUser.safeModel().id}));
      sendMail(req,'Create new password',token,"user");
      return res.json({
        success:'Email Sent'
      });
    })
    .catch(e => next(e));
}

function createNewPassword(req, res, next){
  let user = commonHelpere.decryptedString(req.body.token);
  user = JSON.parse(user);
  User.get(user.id).then((foundUser)=>{
    const userObj = new User(foundUser);
    const genPass = userObj.generatePassword(req.body.newPassword)
    foundUser.password = genPass.hashPassword;
    foundUser.salt = genPass.salt;
    foundUser.isActive = 1;
    return foundUser.save();
  }).then(savedUser => res.json(savedUser.safeModel()))
  .catch(e => next(e));  
} 

function createNewPasswordVyakar(req,res,next){
  let vyakar = commonHelpere.decryptedString(req.body.token);
  vyakar = JSON.parse(vyakar);
  if(vyakar.role === "VykarAdmin"){
    VyakarAdmins.getVyakarById(vyakar.id).then((foundUser)=>{
        const userObj = new VyakarAdmins(foundUser);
        const genPass = userObj.generatePassword(req.body.newPassword)
        foundUser.password = genPass.hashPassword;
        foundUser.salt = genPass.salt;
        foundUser.isActive = 1;
        return foundUser.save();
      }).then(savedUser => res.json(savedUser.safeModel()))
      .catch(e => next(e));
  }else{
      return res.json({
          message:'Not authorized user!'
      })
  }
    
}

function vyakarLogin(req,res,next){
  VyakarAdmins.getVyakarByEmailWithActive(req.body.email).then((foundVyakar)=>{
  if(!foundVyakar){
      return Promise.reject(new APIError('User not exist!', httpStatus.CONFLICT, true));
  }
  if(!foundVyakar.validPassword(req.body.password)){
      const err = new APIError('Email or Password wrong', httpStatus.UNAUTHORIZED, true);
      return next(err);
  }
  const vyakar = foundVyakar.safeModel();
  vyakar.role = "VykarAdmin";
  const token =  jwt.sign(vyakar, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  vyakar.role = 3
  return res.json({
      token,
      user:vyakar
  });
  })
  .catch(e => next(e))
}

function sendMail(req,subject,secret,role){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'suhagtest@gmail.com',
      pass: 'SuhagTest88'
    }
  });  

  const mailOptions = {
    from: 'vyakaradmin@no-reply.com',
    to: req.body.email,
    subject: subject,
    html: `<a href='http://localhost:4200/createNewPassword/${role}/${secret}/'>http://localhost:4200/createNewPassword/${role}/${secret}</a>`,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { login, register , createNewPassword ,createLinkfornewPassword , vyakarLogin , createNewPasswordVyakar};
