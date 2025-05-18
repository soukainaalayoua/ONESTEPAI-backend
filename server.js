require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const startEmailScheduler = require("./config/emailScheduler");

// Middleware & Routes setup...
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const taskRoutes = require("./routes/taskRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use(authMiddleware.protect);
app.use("/api/goals", goalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("✅ API is working");
});
connectDB()
  .then(() => {
    // Start scheduler only once DB is ready:
    startEmailScheduler();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to DB:", error.message);
    process.exit(1);
  });
