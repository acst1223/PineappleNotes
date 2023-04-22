const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const cors = require("cors");

const authRoute = require("./routes/auth.route")
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

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
