const mongoose = require("mongoose");
const validator = require("validator");

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    deadline: {
      type: Date,
      required: [true, "Please add a deadline"],
      validate: {
        validator: function (value) {
          return value > Date.now(); // Ensure deadline is in the future
        },
        message: "Deadline must be a future date",
      },
    },
    progress: {
      type: Number,
      default: 0,
    },
    report: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;
