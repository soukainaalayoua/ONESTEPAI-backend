const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  toggleTaskCompletion,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// @route   PATCH /api/tasks/:id/toggle (Toggle task completion)
router.patch("/:id/toggle", protect, toggleTaskCompletion);

// @route   POST /api/tasks (Create task)
router.post("/", protect, createTask);

// @route   PUT /api/tasks/:id (Update task)
router.put("/:id", protect, updateTask);

// @route   DELETE /api/tasks/:id (Delete task)
router.delete("/:id", protect, deleteTask);

module.exports = router;
