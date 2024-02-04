require("dotenv").config();
const OpenAI = require("openai");
const supabase = require("../../db/supabase");

const ts2md_id = "asst_fnBdBUj9ef4kdeq1B9uCEYNZ";
const openAIKey = process.env.OPENAI_KEY;

const openai = new OpenAI({ apiKey: openAIKey });

async function queryAI(note_id, ts_message) {
  try {
    const { data: note, error: noteError } = await supabase
      .from("note")
      .select("user_id, thread_id")
      .eq("note_id", note_id)
      .single();
    if (noteError) {
      throw noteError;
    }
    const { user_id, thread_id } = note;

    console.log("message:", ts_message);

    const { data: user, error: userError } = await supabase
      .from("user")
      .select("note_preferences")
      .eq("user_id", user_id)
      .single();

    if (userError) {
      throw userError;
    }

    const { note_preferences } = user;

    // Creating a new thread if doesn't exist
    if (!thread_id) {
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: ts_message,
          },
        ],
      });
      const messages = await sendAICall(thread.id, note_preferences);

      const { error } = await supabase
        .from("note")
        .update({ thread_id: thread.id })
        .eq("note_id", note_id);

      if (error) {
        throw error;
      }

      return messages;
    } else {
      const message = await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: ts_message,
      });
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
    throw new Error(`Run status: ${runRetrieve.status}`);
  }
};
