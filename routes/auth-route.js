const router = require("express").Router();
const StatusCodes = require("http-status-codes").StatusCodes;

const validation = require("../validation");
const User = require("../models/user-model");
const constants = require("../constants/constants");

const encrypt = require("../controllers/encrypt");
const encryptPasswordSync = encrypt.encryptPasswordSync;
const comparePassword = encrypt.comparePassword;

router.post("/register", async (req, res) => {
    // check the validation of data
    const { error } = validation.registerSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    // check if the user exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(StatusCodes.BAD_REQUEST).send(constants.EMAIL_REGISTERED_ERROR);

    // register the user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: encryptPasswordSync(req.body.password),
    })
    try {
        const savedUser = await newUser.save();
        res.status(StatusCodes.CREATED).send(savedUser);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send(err);
    }
})

module.exports = router;