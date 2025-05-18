const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTasksForGoal = async (title, description) => {
  const prompt = `
You are a helpful assistant. A user wants to achieve this goal:

Goal Title: "${title}"
Goal Description: "${description}"

Please break down this goal into 7 to 9 short, clear, and practical steps/tasks the user should follow. Return the result as a JSON array of strings like this:
Example output:
[
  "First task here",
  "Second task here",
  "Third task"
  ...
]
`;

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    let jsonString = chatResponse.choices[0].message.content;

    const start = jsonString.indexOf("[");
    const end = jsonString.lastIndexOf("]");
    jsonString = jsonString.substring(start, end + 1);
    const taskArray = JSON.parse(jsonString);
    return taskArray;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
};

module.exports = { generateTasksForGoal };
