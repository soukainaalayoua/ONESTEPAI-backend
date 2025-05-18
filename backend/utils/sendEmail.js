// // sendEmail.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// function sendEmail(to, subject, text) {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error("❌ Failed to send email:", err);
//     } else {
//       console.log("📧 Email sent:", info.response);
//     }
//   });
// }

// module.exports = sendEmail;

// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, text }) {
  console.log("✉️ sendEmail params:", { to, subject, text });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}

module.exports = sendEmail;
