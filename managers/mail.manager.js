const nodemailer = require("nodemailer");
const Transport = require("nodemailer-sendinblue-transport");

const port = require("../configs").port;
const confirmationURLString = `${process.env.SITE_URL}:${port}/api/auth/confirm`;

const transporter = nodemailer.createTransport(
    new Transport({
        apiKey: process.env.SENDINBLUE_API_KEY
    })
);

async function sendConfirmationMail(username, email, confirmationCode) {
    const link = new URL(confirmationURLString);
    link.search = new URLSearchParams({ username, confirmationCode })
    const linkString = link.toString();
    const info = await transporter.sendMail({
        from: process.env.SENDINBLUE_MAIL_ADDR,
        to: email,
        subject: "Pineapple Notes - Please confirm your email address",
        text: `Hi, ${username}!

            Thanks for signing up for Pineapple Notes!
            Please click the link below to verify your account.
            LINK: ${linkString}

            Regards,
            Pineapple Notes`,
        html: `<p>Hi, ${username}!<br />
            <br />
            Thanks for signing up for Pineapple Notes!<br />
            Please click the link below to verify your account.<br />
            LINK: ${linkString}<br/>
            <br />
            Regards,<br />
            Pineapple Notes</p>`
    });
    return info.messageId;
}

module.exports.sendConfirmationMail = sendConfirmationMail;