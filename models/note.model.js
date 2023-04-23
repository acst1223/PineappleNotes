const mongoose = require('mongoose');
const constants = require('../constants/constants');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: constants.TITLE_MIN_LEN,
        maxLength: constants.TITLE_MAX_LEN,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

const noteModel = mongoose.model('Note', noteSchema);

module.exports = noteModel;