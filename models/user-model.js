const mongoose = require("mongoose");
const constants = require("../constants/constants");
const {STATUS_PENDING, STATUS_ACTIVE} = require("../constants/constants");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: constants.USERNAME_MIN_LEN,
        maxLength: constants.USERNAME_MAX_LEN,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: constants.EMAIL_MIN_LEN,
        maxLength: constants.EMAIL_MAX_LEN,
    },
    password: {
        type: String,
        required: true,
        minLength: constants.PASSWORD_CIPHER_MIN_LEN,
        maxLength: constants.PASSWORD_CIPHER_MAX_LEN,
    },
    status: {
        type: String,
        enum: [STATUS_PENDING, STATUS_ACTIVE],
        default: STATUS_PENDING
    },
    confirmationCode: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;