// Helper function to generate tasks for a goal
function generateTasksForGoal(title, description) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("learn") || lowerTitle.includes("study")) {
    return [
      "Research learning resources and materials",
      "Create a study schedule",
      "Complete beginner tutorials",
      "Practice with simple exercises",
      "Join a community or forum for support",
      "Work on an intermediate project",
      "Review progress and identify gaps",
      "Take an assessment or test your knowledge",
    ];
  } else if (
    lowerTitle.includes("fitness") ||
    lowerTitle.includes("exercise") ||
    lowerTitle.includes("workout")
  ) {
    return [
      "Define specific fitness goals and metrics",
      "Create a weekly workout schedule",
      "Research proper exercise techniques",
      "Buy necessary equipment or gym membership",
      "Track nutrition and diet",
      "Complete workouts consistently",
      "Measure progress weekly",
      "Adjust workout plan based on results",
    ];
  } else {
    return [
      "Research and gather information",
      "Create a detailed plan",
      "Identify resources needed",
      "Set up initial framework",
      "Complete first milestone",
      "Review progress and adjust plan",
      "Implement remaining components",
      "Final review and completion",
    ];
  }
}

// Helper function to generate a report for a goal
function generateReportForGoal(goal, tasks) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date();
  const deadline = new Date(goal.deadline);
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  let status = "";
  let recommendations = "";

  if (progress < 25) {
    status = "You're just getting started";
    recommendations =
      "Focus on getting momentum by completing the first few tasks. Breaking down initial barriers is key to progress.";
  } else if (progress < 50) {
    status = "You're making steady progress";
    recommendations =
      "Keep up the good work! Try to maintain consistent effort and complete at least one task every few days.";
  } else if (progress < 75) {
    status = "You're well on your way";
    recommendations =
      "You've made significant progress! Now focus on the more challenging tasks that might require extra attention.";
  } else if (progress < 100) {
    status = "You're in the final stretch";
    recommendations =
      "You're almost there! Prioritize the remaining tasks and push through to completion.";
  } else {
    status = "Congratulations on completing your goal!";
    recommendations =
      "Consider setting a new goal that builds on what you've accomplished.";
  }

  if (daysRemaining < 0) {
    recommendations +=
      "\n\nNote: Your deadline has passed. Consider either extending your deadline or focusing intensely on completing remaining tasks.";
  }

  const report = `
Goal Progress Summary:

Current Status: ${status}

You have completed ${completedTasks} out of ${totalTasks} tasks (${progress}% complete).
There are ${
    daysRemaining > 0 ? daysRemaining : "no"
  } days remaining until your target date.

Recommendations:
${recommendations}

Next Steps:
${tasks
  .filter((task) => !task.completed)
  .slice(0, 3)
  .map((task) => `- ${task.title}`)
  .join("\n")}

Keep going! Breaking your goal into manageable tasks is the key to success.
  `;

  return report.trim();
}

module.exports = { generateTasksForGoal, generateReportForGoal };
