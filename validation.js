const Joi = require("joi");

const constants = require("./constants/constants")

const registerSchema = Joi.object({
    username: Joi.string().required().min(constants.USERNAME_MIN_LEN).max(constants.USERNAME_MAX_LEN),
    email: Joi.string().required().min(constants.EMAIL_MIN_LEN).max(constants.EMAIL_MAX_LEN),
    password: Joi.string().required().min(constants.PASSWORD_PLAIN_MIN_LEN).max(constants.PASSWORD_PLAIN_MAX_LEN),
});

const loginSchema = Joi.object({
    username: Joi.string().required().min(constants.USERNAME_MIN_LEN).max(constants.USERNAME_MAX_LEN),
    password: Joi.string().required().min(constants.PASSWORD_PLAIN_MIN_LEN).max(constants.PASSWORD_PLAIN_MAX_LEN),
});

const noteSchema = Joi.object({
    title: Joi.string().required().min(constants.TITLE_MIN_LEN).max(constants.TITLE_MAX_LEN),
    content: Joi.string().required(),
});

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
module.exports.noteSchema = noteSchema;