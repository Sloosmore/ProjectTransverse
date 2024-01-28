require("dotenv").config();
const OpenAI = require("openai");
const fsPromises = require("fs").promises;
const path = require("path");
const pool = require("../../db/db");

const ts2md_id = "asst_fnBdBUj9ef4kdeq1B9uCEYNZ";
const openAIKey = process.env.OPENAI_KEY;

const openai = new OpenAI({ apiKey: openAIKey });

async function queryAI(note_id, message) {
  try {
    // Creating a new thread
    const grabThreadRec =
      "SELECT user_id, thread_id FROM note WHERE note_id = $1";
    const threadRecParam = [note_id];
    const { rows: noteRow } = await pool.query(grabThreadRec, threadRecParam);
    const { user_id, thread_id } = noteRow[0];

    console.log("message:", message);

    const grabPrefRec =
      'SELECT note_preferences FROM "user" WHERE user_id = $1';
    const prefParam = [user_id];
    const { rows: userRow } = await pool.query(grabPrefRec, prefParam);
    const { note_preferences } = userRow[0];

    if (!thread_id) {
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
      const messages = await sendAICall(thread.id, note_preferences);

      const writeThreadID = "UPDATE note SET thread_id = $1 WHERE note_id = $2";
      const threadParam = [thread.id, note_id];
      const res = await pool.query(writeThreadID, threadParam);

      return messages;
    } else {
      const messages = await sendAICall(thread_id, note_preferences);
      return messages;
    }
  } catch (error) {
    // Error handling
    console.error("Error in queryAI function:", error.message);
    console.error(`Stack trace: ${error.stack}`);

    return null; // or throw error; depending on how you want to handle this in the calling code
  }
}

module.exports = { queryAI };
//

const sendAICall = async (threadID, note_preferences) => {
  // Running the assistant
  const customIntructions =
    note_preferences ||
    "Write brief concise bullet points on every topic discussed, make sure to bold any interesting vocabulary and clearly define it";
  const run = await openai.beta.threads.runs.create(threadID, {
    assistant_id: ts2md_id,
    instructions: customIntructions,
  });

  let runRetrieve = await openai.beta.threads.runs.retrieve(threadID, run.id);
  while (
    ["completed", "failed", "expired"].includes(runRetrieve.status) === false
  ) {
    runRetrieve = await openai.beta.threads.runs.retrieve(threadID, run.id);
    await new Promise((r) => setTimeout(r, 500));
  }

  // Check if the run status is completed
  if (runRetrieve.status === "completed") {
    const messages = await openai.beta.threads.messages.list(threadID);
    return messages;
  } else {
    // Handling non-completed statuses
    throw new Error(`Run status: ${run.status}`);
  }
};
