import { supabaseClient } from "@/config/supabaseClient";

const insertNewNoteRecord = async ({ user_id, title, folder_id, note_id }) => {
  const status = "inactive"; //"active"
  const is_deleted = false;
  const thread_id = "";

  const active_transcript = "";
  const full_transcript = "";
  const full_markdown = "";
  const visible = "true";
  //this may not be needed... but need to make sure that this happens before play does
  const play_timestamps = []; //new Date()
  const pause_timestamps = [];
  const json_content = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: {
          time: 0,
        },
        content: [
          {
            text: "",
            type: "text",
          },
        ],
      },
    ],
  };
  const diagram_message_count = 0;
  const note_gen_on = false;
  const diagram_gen_on = false;
  const new_json = "";

  console.log("----------------------");
  console.log("user_id", user_id);

  try {
    //deactivate records
    //grabs all the notes and not just the ones that are deleted

    //send new record
    const { data: record, error: insertError } = await supabaseClient
      .from("note")
      .insert({
        note_id,
        user_id,
        title,
        status,
        date_created: new Date(),
        date_updated: new Date(),
        is_deleted,
        active_transcript,
        full_transcript,
        full_markdown,
        thread_id,
        visible,
        play_timestamps,
        pause_timestamps,
        json_content,
        folder_id,
        diagram_message_count,
        note_gen_on,
        diagram_gen_on,
        new_json,
      })
      .select();

    if (insertError) {
      throw insertError;
    }
    return record;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
};

export default insertNewNoteRecord;
