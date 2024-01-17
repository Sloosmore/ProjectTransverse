require("dotenv").config();
const OpenAI = require("openai");
const fsPromises = require("fs").promises;
const path = require("path");

const ts2md_id = "asst_fnBdBUj9ef4kdeq1B9uCEYNZ";
const openAIKey = process.env.OPENAI_KEY;

const openai = new OpenAI({ apiKey: openAIKey });

async function queryAI(message) {
  try {
    // Creating a new thread
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Running the assistant
    configPath = path.join(__dirname, "../../files/settings/LLMconfig.txt");
    const customIntructions =
      (await fsPromises.readFile(configPath, "utf8")) ||
      "Write brief concise bullet points on every topic discussed, make sure to bold any interesting vocabulary and clearly define it";
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ts2md_id,
      instructions: customIntructions,
    });

    let runRetrieve = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    while (
      ["completed", "failed", "expired"].includes(runRetrieve.status) === false
    ) {
      runRetrieve = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise((r) => setTimeout(r, 500));
    }

    // Check if the run status is completed
    if (runRetrieve.status === "completed") {
      const messages = await openai.beta.threads.messages.list(thread.id);
      console.log(message);
      return messages;
    } else {
      // Handling non-completed statuses
      throw new Error(`Run status: ${run.status}`);
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
