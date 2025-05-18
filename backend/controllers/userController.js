const User = require("../models/User");

const makeUserPro = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPro = true;
    await user.save();

    res.status(200).json({ message: "User upgraded to Pro" });
  } catch (error) {
    console.error("Error upgrading user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  makeUserPro,
};
