// config/emailScheduler.js
const cron = require("node-cron");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

function startEmailScheduler() {
  // every day at 08:00
  cron.schedule("0 10 * * *", async () => {
    try {
      const users = await User.find();
      users.forEach((user) => {
        sendEmail({
          to: user.email,
          subject: "🔔 Friendly Reminder: Stay on Track with Your Goals!",
          text: `👋 Hello ${user.name},

We hope you're having an amazing day! 🌞

This is your **daily spark of motivation** from OneStep! 🚀
Remember, your dreams are valid and **every small action today brings you closer to your goals**. You’ve already come so far — keep that momentum going! 💥

✨ _“Success doesn’t come from what you do occasionally, it comes from what you do consistently.”_

➡️ **Open the app now** and crush your next task. Your future self will thank you!

You’ve got this 💪  
— The OneStep Team 💫
`,
        });
      });
      console.log(`📧 Sent reminders to ${users.length} users.`);
    } catch (err) {
      console.error("❌ Failed to send daily reminders:", err);
    }
  });
}

module.exports = startEmailScheduler;
