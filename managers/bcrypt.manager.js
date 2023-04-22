const bcrypt = require("bcrypt");
const constants = require("../constants/constants");

function encryptPasswordSync(plainPassword) {
    return bcrypt.hashSync(plainPassword, constants.BCRYPT_N_ROUNDS);
}

function comparePassword(plainPassword, cipherPassword, cb) {
    bcrypt.compare(plainPassword, cipherPassword, (err, isMatch) => {
        if (err) {
            return cb(err, isMatch);
        }
        cb(null, isMatch);
    });
}

module.exports.encryptPasswordSync = encryptPasswordSync;
module.exports.comparePassword = comparePassword;