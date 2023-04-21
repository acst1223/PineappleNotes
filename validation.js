const Joi = require("joi");

const constants = require("./constants/constants")

const registerSchema = Joi.object({
    username: Joi.string().required().min(constants.USERNAME_MIN_LEN).max(constants.USERNAME_MAX_LEN),
    email: Joi.string().required().min(constants.EMAIL_MIN_LEN).max(constants.EMAIL_MAX_LEN),
    password: Joi.string().required().min(constants.PASSWORD_PLAIN_MIN_LEN).max(constants.PASSWORD_PLAIN_MAX_LEN),
})

module.exports.registerSchema = registerSchema;