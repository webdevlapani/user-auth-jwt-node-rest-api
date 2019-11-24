const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.newPassSec);
 
const encryptedString = (data)=>{ return cryptr.encrypt(data) };
const decryptedString = (encryptedString)=> { return cryptr.decrypt(encryptedString) };

module.exports = {
    encryptedString,
    decryptedString
}
