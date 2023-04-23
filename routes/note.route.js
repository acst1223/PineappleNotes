const router = require("express").Router();
const StatusCodes = require("http-status-codes").StatusCodes;

const validation = require("../validation");
const Note = require("../models/note.model");

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

module.exports = router;