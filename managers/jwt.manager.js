const jwtManager = require("jsonwebtoken");

const REGISTER_JWT_SECRET = process.env.REGISTER_JWT_SECRET;

function generateConfirmationCode(email) {
    return jwtManager.sign({ email }, REGISTER_JWT_SECRET);
}

module.exports.generateConfirmationCode = generateConfirmationCode;