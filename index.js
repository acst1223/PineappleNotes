const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
require("./managers/passport.manager")(passport);
const cors = require("cors");
const StatusCodes = require("http-status-codes").StatusCodes;

const authRoute = require("./routes/auth.route");
const noteRoute = require("./routes/note.route");

const constants = require("./constants/constants");
const port = require("./configs").port;

// connect to DB
mongoose
    .connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to Mongo Altas.");
    })
    .catch((e) => {
        console.log(e);
    });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use("/api/auth", authRoute);
app.use("/api/note", passport.authenticate("jwt", { session: false }), noteRoute);

// default error handler
app.use((err, req, res, next) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(constants.INTERNAL_SERVER_ERROR);
    console.log(err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
