const express = require("express");
const router = express.Router();
const { makeUserPro } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.patch("/make-pro", protect, makeUserPro);

module.exports = router;
