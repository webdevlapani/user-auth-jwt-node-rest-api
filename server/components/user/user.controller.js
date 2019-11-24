const User = require('./user.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  return User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user.safeModel());
}

/**
 * Get user profile of logged in user
 * @returns {Promise<User>}
 */
function getProfile(req, res, next) {
  return User.get(res.locals.session.id)
    .then(user => res.json(user.safeModel()))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
function update(req, res, next) {
  const { user } = req;
  user.email = req.body.email;
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.role = req.body.role || user.role

  return user.save()
    .then(savedUser => res.json(savedUser.safeModel()))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Promise<User[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function destroy(req, res, next) {
  const { user } = req;
  user.isDelete = 1;
  user.save()
    .then(savedUser => res.json(savedUser.safeModel()))
    .catch(e => next(e));
}


/**
 * Activate user.
 * @returns {User}
 */

/**
 * Update user password.
 * @returns {User}
 */
function updatePassword(req, res, next) {
  const { user } = req;
  const userObj = new User({password:user.password});
  if (userObj.validPassword(req.body.oldPassword)){
    const genPass = userObj.generatePassword(req.body.newPassword)
    user.password = genPass.hashPassword;
    user.salt = genPass.salt;
    user.save()
    .then(savedUser => res.json(savedUser.safeModel()))
    .catch(e => next(e));
  }
  else{
    res.json({message:'old password not match'});
  }
}

function getAllAdmins (req,res,next) {
   return User.getAllByrole(1,res.locals.session.ClientId,res.locals.session.id).then((adminList)=>{
        return res.json({"admins":adminList.map((o)=>o.safeModel())});
    })
}

function getAllClients (req,res,next) {
   return User.getAllByrole(2,res.locals.session.ClientId,0).then((adminList)=>{
        return res.json({"clients":adminList.map((o)=>o.safeModel())});
    })
}

module.exports = {
  load,
  get,
  getProfile,
  update,
  list,
  destroy,
  updatePassword,
  getAllAdmins,
  getAllClients
};
