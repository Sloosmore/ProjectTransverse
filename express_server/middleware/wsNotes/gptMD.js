require("dotenv").config();
const OpenAI = require("openai");
const supabase = require("../../db/supabase");

const ts2md_id = "asst_fnBdBUj9ef4kdeq1B9uCEYNZ";
const ts2mermaid_id = "asst_7001vT1ZBwvNasbbsAVerSkB";
const openAIKey = process.env.OPENAI_KEY;

const openai = new OpenAI({ apiKey: openAIKey });

async function queryAI(note_id, ts_message, frequency) {
  try {
    const { data: note, error: noteError } = await supabase
      .from("note")
      .select(
        "user_id, thread_id, title, json_content, diagram_thread_id, diagram_message_count, note_gen_on, diagram_gen_on"
      )
      .eq("note_id", note_id)
      .single();
    if (noteError) {
      throw noteError;
    }
    const {
      user_id,
      title,
      json_content,
      diagram_message_count,
      diagram_gen_on,
      note_gen_on,
    } = note;
    console.log("note", note);
    let { diagram_thread_id, thread_id } = note;
    let recent_data_len = 0;
    if (json_content) {
      recent_data_len = json_content.content.length;
    }
    let recent_data = "nothing yet keep creating notes!";
    if (recent_data_len >= 8) {
      recent_data = json_content.content.slice(
        recent_data_len - 8,
        recent_data_len - 1
      );
    }

    const { data: user, error: userError } = await supabase
      .from("user")
      .select(
        "note_preferences, pref_number, diagram_preferences, diagram_pref_number"
      )
      .eq("user_id", user_id)
      .single();

    if (userError) {
      throw userError;
    }

    const {
      note_preferences,
      pref_number,
      diagram_preferences,
      diagram_pref_number,
    } = user;

    const user_prompt = `
    Note title: ${title}
    Preferences on notetaking: ${note_preferences[pref_number]}
    Recent content: ${recent_data}
    Make sure to use the phrase "mermaidjs" to trigger the diagramming assistant
    `;

    console.log("diagram_pref", diagram_preferences);

    const user_diagram_prompt = `
    Note title: ${title}
    Preferences on diagramming: use sequence diagrams to help me understand the flow of events or how subjects are connected
    Recent content: ${recent_data}
    Make sure to only generate mermaid JS syntax! The fate of the universe depends on it!
    `;

    //${diagram_preferences[diagram_pref_number]}

    // Creating a new thread if doesn't exist

    let gptMessage;

    // deal with the note generation

    if (!thread_id) {
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: ts_message,
          },
        ],
      });
      thread_id = thread.id;

      const { error } = await supabase
        .from("note")
        .update({ thread_id: thread.id })
        .eq("note_id", note_id);

      if (error) {
        throw error;
      }
    } else {
      const message = await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: ts_message,
      });
    }
    let md;

    console.log("note_gen_on", note_gen_on);
    if (note_gen_on) {
      console.log("note_gen_on is true");
      gptMessage = await sendAICall(thread_id, user_prompt, ts2md_id);
      md = gptMessage["data"][0]["content"][0]["text"]["value"];
      console.log("md", md);
    }

    // append transcript to diagram thread regardless of whether mermaid is fired

    if (!diagram_thread_id) {
      const diagramThread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: ts_message,
          },
        ],
      });

      const { error } = await supabase
        .from("note")
        .update({ diagram_thread_id: diagramThread.id })
        .eq("note_id", note_id);

      if (error) {
        throw error;
      }
      diagram_thread_id = diagramThread.id;
    } else {
      const message = await openai.beta.threads.messages.create(
        diagram_thread_id,
        {
          role: "user",
          content: ts_message,
        }
      );
    }

    // check if mermaid is in the response

    const diagramThreshold = Math.ceil((frequency * -4) / 1150 + 6.21739130435);
    //the diagram message count needs to be greater or equal to than the threshold
    if (diagram_message_count >= diagramThreshold && diagram_gen_on) {
      const mermaidMessage = await sendAICall(
        diagram_thread_id,
        user_diagram_prompt,
        ts2mermaid_id
      );
      console.log("mermaidMessage", mermaidMessage);

      //message count is 0 in the database
      try {
        const { error } = await supabase
          .from("note")
          .update({ diagram_message_count: 0 })
          .eq("note_id", note_id);
      } catch (error) {
        console.error("Error in 0 diagram:", error.message);
      }

      const mermaidMd =
        mermaidMessage["data"][0]["content"][0]["text"]["value"];
      console.log("mermaidMd", mermaidMd);
      return md + "\n\n" + mermaidMd;
    } else {
      const updatedCount = diagram_message_count + 1;
      try {
        const { error } = await supabase
          .from("note")
          .update({ diagram_message_count: updatedCount })
          .eq("note_id", note_id);
      } catch (error) {
        console.error("Error in +1 diagram:", error.message);
      }

      return md;
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

const sendAICall = async (threadID, note_preferences, assistant_id) => {
  // Running the assistant
  //if there is not a note preference, and the assistant is the markdown assistant, then use the default instructions else use the diagramming instructions
  console.log(threadID, note_preferences);
  const run = await openai.beta.threads.runs.create(threadID, {
    assistant_id: assistant_id,
    instructions: note_preferences,
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
