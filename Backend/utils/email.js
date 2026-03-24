const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your@gmail.com",        // 👈 apna email
    pass: "your_app_password",     // 👈 gmail app password
  },
});

const sendEmail = (to, subject, text) => {
  return transporter.sendMail({
    from: "your@gmail.com",
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;