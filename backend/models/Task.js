const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Goal",
    },
    title: {
      type: String,
      required: [true, "Please add a task title"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
