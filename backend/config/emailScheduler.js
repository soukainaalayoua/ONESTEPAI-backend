// config/emailScheduler.js
const cron = require("node-cron");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

function startEmailScheduler() {
  // every day at 08:00
  cron.schedule("0 23 * * *", async () => {
    try {
      const users = await User.find();
      users.forEach((user) => {
        sendEmail(
          user.email,
          "🔔 Friendly Reminder: Stay on Track with Your Goals!",
          `Hello ${user.name},\n\nWe hope you're doing well! 🌟\n\nThis is your daily gentle reminder to check in on your tasks and keep making progress toward your goals. Every small step counts, and you're doing great!\n\nKeep up the momentum 💪\n\n— The OneStep Team 🚀`
        );
      });
      console.log(`📧 Sent reminders to ${users.length} users.`);
    } catch (err) {
      console.error("❌ Failed to send daily reminders:", err);
    }
  });
}

module.exports = startEmailScheduler;
