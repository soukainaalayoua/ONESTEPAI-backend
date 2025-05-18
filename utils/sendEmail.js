const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// teste
cron.schedule("* * * * *", async () => {
  console.log("✅ Cron triggered");
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
