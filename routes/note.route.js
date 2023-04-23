const router = require("express").Router();
const StatusCodes = require("http-status-codes").StatusCodes;

const validation = require("../validation");
const Note = require("../models/note.model");
const constants = require("../constants/constants");

// create a new note
router.post("/create", async (req, res, next) => {
    const { error } = validation.noteSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    const { title, content } = req.body;
    const newNote = new Note({
        title,
        content,
        author: req.user._id
    });

    try {
        const savedNote = await newNote.save();
        res.status(StatusCodes.CREATED).send(savedNote);
    } catch (err) {
        return next(err);
    }
});

// get note by id
router.get("/:_id", async (req, res, next) => {
    const { _id } = req.params;
    try {
        const note = await Note.findById(_id).populate("author", "username").exec();
        if (!note) return res.status(StatusCodes.NOT_FOUND).send(constants.NOTE_NOT_FOUND_ERROR);

        // check if the user is the author of the note
        if (!note.author._id.equals(req.user._id))
            return res.status(StatusCodes.FORBIDDEN).send(constants.NOTE_NO_PERMISSION_ERROR);
        res.status(StatusCodes.OK).send(note);
    } catch (err) {
        return next(err);
    }
});

// delete note by id
router.delete("/:_id", async (req, res, next) => {
    const { _id } = req.params;
    try {
        const note = await Note.findById(_id).exec();
        if (!note) return res.status(StatusCodes.NOT_FOUND).send(constants.NOTE_NOT_FOUND_ERROR);

        // check if the user is the author of the note
        if (!note.author._id.equals(req.user._id))
            return res.status(StatusCodes.FORBIDDEN).send(constants.NOTE_NO_PERMISSION_ERROR);
        await Note.deleteOne({_id: _id}).exec();
        res.status(StatusCodes.OK).send(constants.DELETE_NOTE_SUCCESS);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;