const express = require("express");
const {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  generateReport,
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// route   GET /api/goals (Get all goals)
router.get("/", protect, getGoals);

// route   GET /api/goals/:id (Get single goal)
router.get("/:id", protect, getGoalById);

// route   POST /api/goals(Create new goal)
router.post("/", protect, createGoal);

// route   PUT /api/goals/:id (Update goal)
router.put("/:id", protect, updateGoal);

// route   DELETE /api/goals/:id (Delete goal)
router.delete("/:id", protect, deleteGoal);

// route   POST /api/goals/:id/report (Generate AI report for goal)
router.post("/:id/report", protect, generateReport);

module.exports = router;
