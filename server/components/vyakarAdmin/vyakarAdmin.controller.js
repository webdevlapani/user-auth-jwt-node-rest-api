const VyakarAdmins = require('./vyakarAdmin.model');
const Client = require('../client/client.model');
const User = require('../user/user.model');
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const commonHelpere = require('../../helpers/commonHelper');
const nodemailer = require('nodemailer');


function createNewVyakar(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
        const vyakarAdmin = new VyakarAdmins(req.body);
        VyakarAdmins.getVyakarByEmail(req.body.email).then((foundVyakar)=>{
        if(foundVyakar){
            return Promise.reject(new APIError('User already exist!', httpStatus.CONFLICT, true));
        }
        vyakarAdmin.password = 'WrongPassword';
        vyakarAdmin.salt = 'WrongPassword';
        return vyakarAdmin.save();
        }).then((savedVyakar)=>{
            const vyakar = { id : savedVyakar.safeModel().id } ;
            vyakar.role = "VykarAdmin";
            const token = commonHelpere.encryptedString(JSON.stringify(vyakar));
            sendMail(req,'Verify your account',token,"vyakar")
            res.json({
                success:'vyakarAdmin register succesfully',
            });
        }).catch(e => next(e))
    }else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
   
}

function login(req,res,next){
    VyakarAdmins.getVyakarByEmailWithActive(req.body.email).then((foundVyakar)=>{
    if(!foundVyakar){
        return Promise.reject(new APIError('User not exist!', httpStatus.CONFLICT, true));
    }
    const vyakar = foundVyakar.safeModel();
    vyakar.role = "VykarAdmin";
    const token =  jwt.sign(vyakar, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });
    return res.json({
        token,
        user:vyakar
    });
    })
    .catch(e => next(e))
}

function updateVyakar(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
    VyakarAdmins.getVyakarById(req.body.id).then((foundVyakar)=>{
    if(!foundVyakar){
        return Promise.reject(new APIError('User not exist!', httpStatus.CONFLICT, true));
    }
    foundVyakar.firstName = req.body.firstName;
    foundVyakar.lastName = req.body.lastName;
    foundVyakar.save();
    return res.json({
        success:"User update successfully!",
        user:foundVyakar.safeModel()
    });
    })
    .catch(e => next(e))
    }
    else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
}

function deleteVyakar(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
    VyakarAdmins.getVyakarById(req.params.id).then((foundVyakar)=>{
    if(!foundVyakar){
        return Promise.reject(new APIError('User not exist!', httpStatus.CONFLICT, true));
    }
    foundVyakar.isDelete = 1;
    foundVyakar.save();
    return res.json({
        success:"User delete successfully!",
        user:foundVyakar.safeModel()
    });
    })
    .catch(e => next(e))
    }
    else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
}

function getAllClient(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
        Client.getAllClient().then((allClients)=>{
            return res.json({
                clients:allClients
            });
        })
    }else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
}

function getAllUserByClientId(req,res,next) {
    if(res.locals.session.role === "VykarAdmin"){
        User.getAllUserByClientId(req.params.ClientId).then((allUser)=>{
            return res.json({
                users:allUser
            });
        })
    }else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
}

function getAllClientAdminByClientId(req,res,next) {
    if(res.locals.session.role === "VykarAdmin"){
        User.getAllUserRolewiseByClientId(1,req.params.ClientId).then((allAdmins)=>{
            return res.json({
                admins:allAdmins
            });
        })
    }else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
}

function getAllClientUserByClientId(req,res,next) {
    if(res.locals.session.role === "VykarAdmin"){
        User.getAllUserRolewiseByClientId(2,req.params.ClientId).then((allUser)=>{
            return res.json({
                users:allUser
            });
        })
    }else{
        return res.json({
            message:"Not authorized user!!"
        });
    }
}

function createNewPasswordVyakar(req,res,next){
  const vyakar = jwt.verify(req.body.token, config.jwtSecret);
  if(vyakar.role === "VykarAdmin"){
    VyakarAdmins.getVyakarByEmail(vyakar.email).then((foundUser)=>{
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

function getAllClientAdmin(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
        User.getAllByroleWithoutClientId(1).then((allAdmin)=>{
            return res.json({
                admins:allAdmin
            })
        });
    }else{
        return res.json({
            message:'Not authorized user!'
        });
   }
} 

function getAllClientUser(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
        User.getAllByroleWithoutClientId(2).then((allUser)=>{
            return res.json({
                users:allUser
            })
        });
    }else{
        return res.json({
            message:'Not authorized user!'
        });
   }
} 

function createLinkfornewPasswordVyakar(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
    VyakarAdmins.getVyakarByEmail(req.body.email)
      .then((foundUser) => {
        if (!foundUser) {
          return Promise.reject(new APIError('User not found', httpStatus.CONFLICT, true));
        }
        const vyakar = { id :  foundUser.safeModel().id };
        vyakar.role = "VykarAdmin";
        const token = commonHelpere.encryptedString(JSON.stringify(vyakar));
        sendMail(req,'Create new password',token,"vyakar");
        return res.json({
          success:'Email Sent'
        });
      })
      .catch(e => next(e));
    }else{
        return res.json({
            message:'Not authorized user!'
        });
   }
  }

  function loginAs(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
        User.getByEmail(req.body.email).then((foundUser)=>{
            if(!foundUser){
                return Promise.reject(new APIError('User not found', httpStatus.CONFLICT, true));
            }
            const user = foundUser.safeModel();
            const token =  jwt.sign(user, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn,
                });
            return res.json({
                token,
                user
            });
        }).catch(e => next(e));;
    }else{
        return res.json({
            message:'Not authorized user!'
        });
   }
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

function getProfile(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
    VyakarAdmins.getVyakarById(res.locals.session.id).then((foundVyakar)=>{
        const vyakar = foundVyakar.safeModel();
        vyakar.role = 3
        return res.json(vyakar);
    });
    }else{
        return res.json({
                message:'Not authorized user!'
        })
    }
}

function updatePassword(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
    VyakarAdmins.getVyakarById(res.locals.session.id).then((foundVyakar)=>{
        if (foundVyakar.validPassword(req.body.oldPassword)){
            const genPass = foundVyakar.generatePassword(req.body.newPassword)
            foundVyakar.password = genPass.hashPassword;
            foundVyakar.salt = genPass.salt;
            foundVyakar.save()
            .then(savedUser => res.json(savedUser.safeModel()))
            .catch(e => next(e));
        }
        else{
            res.json({message:'old password not match'});
        }
    }).catch(e => next(e));
    }else{
        return res.json({
                message:'Not authorized user!'
        })
    }
}

function getAllVyakar(req,res,next){
    if(res.locals.session.role === "VykarAdmin"){
        VyakarAdmins.getAllVyakar(res.locals.session.id).then((allVyakar)=>{
            return res.json({
                vyakar:allVyakar
            });
        })
    }else{
        return res.json({
                message:'Not authorized user!'
        })
    }

}



module.exports = {
    createNewVyakar,
    login,
    updateVyakar,
    deleteVyakar,
    getAllClient,
    getAllUserByClientId,
    getAllClientAdminByClientId,
    getAllClientUserByClientId,
    createNewPasswordVyakar,
    getProfile,
    updatePassword,
    getAllClientAdmin,
    getAllClientUser,
    getAllVyakar,
    createLinkfornewPasswordVyakar,
    loginAs
}