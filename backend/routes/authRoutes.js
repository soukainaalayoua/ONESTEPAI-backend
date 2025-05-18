// routes/authRoutes.js
const router = require("express").Router();
const {
  sendVerificationCode,
  verifyEmail,
  loginUser,
  getUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// 1) Start registration: send verification code
// POST /api/auth/register
router.post("/register", sendVerificationCode);

// 2) Verify email: activate account and return token
// POST /api/auth/verify-email
router.post("/verify-email", verifyEmail);

// 3) User login (only verified users)
// POST /api/auth/login
router.post("/login", loginUser);

// 4) Get user data (protected)
// GET /api/auth/user
router.get("/user", protect, getUser);

module.exports = router;
