const Goal = require("../models/Goal");
const Task = require("../models/Task");
const { generateTasksForGoal } = require("../utils/ai");

const {
  // generateTasksForGoal,
  generateReportForGoal,
} = require("../utils/goalHelpers");

// route   GET /api/goals (Get all goals)
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    // For each goal, get its tasks
    const goalsWithTasks = await Promise.all(
      goals.map(async (goal) => {
        const tasks = await Task.find({ goal: goal._id }).sort({ order: 1 });
        return {
          ...goal.toObject(),
          tasks,
        };
      })
    );

    res.json(goalsWithTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// route   GET /api/goals/:id (Get single goal)
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Get tasks for this goal
    const tasks = await Task.find({ goal: goal._id }).sort({ order: 1 });

    res.json({
      ...goal.toObject(),
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// route   POST /api/goals (Create new goal)
const createGoal = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !description || !deadline) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Count user's goals
    const goalCount = await Goal.countDocuments({ user: req.user._id });
    // Check if user is not pro and already has 5+ goals
    if (!req.user.isPro && goalCount >= 5) {
      return res.status(403).json({
        message: "Free plan allows up to 5 goals. Upgrade to continue.",
        upgradeButton: true,
      });
    }
    // Create goal
    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      deadline,
    });

    // Generate AI tasks for this goal
    const taskTitles = await generateTasksForGoal(title, description);

    const tasks = await Promise.all(
      taskTitles.map(async (taskTitle, index) => {
        return Task.create({
          goal: goal._id,
          title: taskTitle,
          description: "",
          order: index,
        });
      })
    );

    res.status(201).json({
      ...goal.toObject(),
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// route   PUT /api/goals/:id (Update goal)
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Get tasks for this goal
    const tasks = await Task.find({ goal: updatedGoal._id }).sort({ order: 1 });

    res.json({
      ...updatedGoal.toObject(),
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// route   DELETE /api/goals/:id ( Delete goal)
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Delete goal and all its tasks
    await Task.deleteMany({ goal: goal._id });
    await goal.deleteOne();

    res.json({ message: "Goal deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// route   POST /api/goals/:id/report (Generate AI report for goal)
const generateReport = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Get tasks for this goal
    const tasks = await Task.find({ goal: goal._id });

    // Generate a report
    const report = generateReportForGoal(goal, tasks);

    // Update goal with the report
    goal.report = report;
    await goal.save();

    res.json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  generateReport,
};
