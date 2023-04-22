const jwtManager = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const REGISTER_JWT_SECRET = process.env.REGISTER_JWT_SECRET;

function generateConfirmationCode(email) {
    return jwtManager.sign({ email }, REGISTER_JWT_SECRET);
}

function generatePassportToken( { _id, username, email } ) {
    return jwt.sign({ _id, username, email }, process.env.PASSPORT_JWT_SECRET);
}

module.exports.generateConfirmationCode = generateConfirmationCode;
module.exports.generatePassportToken = generatePassportToken;