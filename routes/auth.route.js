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
const generatePassportToken = jwtManager.generatePassportToken;

const sendConfirmationMail = require("../managers/mail.manager").sendConfirmationMail;

router.post("/register", async (req, res, next) => {
    // check the validation of data
    const { error } = validation.registerSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    // check if the user exists
    let userExists;
    try {
        userExists = await User.findOne({
            $or: [
                {username: req.body.username}, {email: req.body.email}
            ]
        });
    } catch (err) {
        return next(err);
    }
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
        return next(err);
    }
});

router.get("/confirm", async (req, res, next) => {
    const { username, confirmationCode } = req.query;
    let user;
    try {
        user = await User.findOne({username, confirmationCode});
    } catch (err) {
        return next(err);
    }

    if (!user) return res.status(StatusCodes.NOT_FOUND).send(constants.CONFIRMATION_CODE_ERROR);
    user.status = constants.STATUS_ACTIVE;
    try {
        await user.save();
        res.status(StatusCodes.OK).send(constants.CONFIRMATION_CODE_SUCCESS);
    } catch (err) {
        return next(err);
    }
});

router.post("/login", async (req, res, next) => {
    const { error } = validation.loginSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    // check whether user exists
    let user;
    try {
        user = await User.findOne({username: req.body.username});
    } catch (err) {
        return next(err);
    }
    if (!user) return res.status(StatusCodes.UNAUTHORIZED).send(constants.LOGIN_USER_ERROR);

    // check email confirmation status
    if (user.status !== constants.STATUS_ACTIVE)
        return res.status(StatusCodes.UNAUTHORIZED).send(constants.LOGIN_EMAIL_CONFIRMATION_ERROR);

    // compare password
    comparePassword(req.body.password, user.password, (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch) return res.status(StatusCodes.UNAUTHORIZED).send(constants.LOGIN_USER_ERROR);

        // password matched
        const tokenObject = { _id: user._id, username: user.username, email: user.email };
        const token = generatePassportToken(user);
        res.status(StatusCodes.OK).send({ token });
    });
});

module.exports = router;