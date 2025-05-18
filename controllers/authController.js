const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// POST /api/auth/register
// Create or resend verification code
const sendVerificationCode = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please add all fields." });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log("🔢 Generated verification code:", code);

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      // If already verified
      if (existing.isVerified) {
        return res.status(400).json({ message: "Email already registered." });
      }
      // Resend new code
      existing.verifyCode = code;
      await existing.save();
      await sendEmail({
        to: email,
        subject: "كود التحقق",
        text: `رمز التحقق ديالك هو: ${code}`,
      });
      console.log("✉️ sendEmail() called for:", email);
      return res
        .status(200)
        .json({ message: "New verification code sent to your email." });
    }

    // Create new user with code
    const user = await User.create({ name, email, password, verifyCode: code });
    await sendEmail({
      to: email,
      subject: "كود التحقق",
      text: `رمز التحقق ديالك هو: ${code}`,
    });
    return res
      .status(200)
      .json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/auth/verify-email
// Verify code, activate user, return token
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const numericCode = Number(code);
    const user = await User.findOne({ email, verifyCode: numericCode });
    if (!user) {
      return res.status(400).json({ message: "Email or code not valid." });
    }
    user.isVerified = true;
    user.verifyCode = undefined;
    await user.save();
    const token = generateToken(user._id);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first." });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/user
const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendVerificationCode,
  verifyEmail,
  loginUser,
  getUser,
};
