const Task = require("../models/Task");
const Goal = require("../models/Goal");

// Toggle task completion
const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const goal = await Goal.findById(task.goal);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    task.completed = !task.completed;
    await task.save();

    const tasks = await Task.find({ goal: goal._id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;

    goal.progress = Math.round((completedTasks / totalTasks) * 100);
    await goal.save();

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { goalId, title, description } = req.body;

    if (!goalId || !title) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const tasksCount = await Task.countDocuments({ goal: goalId });

    const task = await Task.create({
      goal: goalId,
      title,
      description: description || "",
      order: tasksCount,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const goal = await Goal.findById(task.goal);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const goal = await Goal.findById(task.goal);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    const tasks = await Task.find({ goal: goal._id });
    const totalTasks = tasks.length;

    if (totalTasks > 0) {
      const completedTasks = tasks.filter((t) => t.completed).length;
      goal.progress = Math.round((completedTasks / totalTasks) * 100);
    } else {
      goal.progress = 0;
    }

    await goal.save();

    res.json({ message: "Task removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  toggleTaskCompletion,
  createTask,
  updateTask,
  deleteTask,
};
