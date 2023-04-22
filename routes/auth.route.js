const router = require("express").Router();
const StatusCodes = require("http-status-codes").StatusCodes;

const validation = require("../validation");
const User = require("../models/user.model");
const constants = require("../constants/constants");

const bcryptManager = require("../managers/bcrypt.manager");
const encryptPasswordSync = bcryptManager.encryptPasswordSync;
const comparePassword = bcryptManager.comparePassword;

const jwtManager = require("../managers/jwt.manager");
const generateConfirmationCode = jwtManager.generateConfirmationCode;

const sendConfirmationMail = require("../managers/mail.manager").sendConfirmationMail;

router.post("/register", async (req, res) => {
    // check the validation of data
    const { error } = validation.registerSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    // check if the user exists
    const userExists = await User.findOne({$or: [
            { username: req.body.username }, { email: req.body.email }
        ]});
    if (userExists) {
        if (userExists.username === req.body.username)
            return res.status(StatusCodes.BAD_REQUEST).send(constants.USERNAME_REGISTERED_ERROR);
        // otherwise the email exists
        return res.status(StatusCodes.BAD_REQUEST).send(constants.EMAIL_REGISTERED_ERROR);
    }

    // generate confirmation code
    const confirmationCode = generateConfirmationCode(req.body.email);

    // register the user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: encryptPasswordSync(req.body.password),
        confirmationCode: confirmationCode,
    })
    try {
        const savedUser = await newUser.save();
        res.status(StatusCodes.CREATED).send(savedUser);

        // send confirmation mail only if the user is successfully registered
        sendConfirmationMail(req.body.username, req.body.email, confirmationCode)
            .then((messageId) => { console.log(`Successfully sent confirmation mail, message ID: ${messageId}`); })
            .catch(console.log);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send(err);
    }
});

router.get("/confirm", async (req, res) => {
    const { username, confirmationCode } = req.query;
    const user = await User.findOne({ username, confirmationCode });

    if (!user) return res.status(StatusCodes.NOT_FOUND).send(constants.CONFIRMATION_CODE_ERROR);
    user.status = constants.STATUS_ACTIVE;
    try {
        await user.save();
        res.status(StatusCodes.OK).send(constants.CONFIRMATION_CODE_SUCCESS);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(constants.CONFIRMATION_CODE_ERROR);
    }
});

module.exports = router;