const nodemailer = require("nodemailer");
const logger = require("./logger");
const messages = require("./messages");
const { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_SENDER, MAIL_USER } = require("./keys");

const sendMail = async (recipients, subject, message) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: MAIL_SENDER,
      to: recipients,
      subject,
      html: message
    });

    logger.info(`Mail Service: Message sent ${info.messageId} to ${recipients}`);
  } catch (error) {
    logger.error(`Error sending mail to: ${recipients}`);
  }
};

module.exports = { sendMail, messages };
