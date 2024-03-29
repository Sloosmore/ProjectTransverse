const supabase = require("../../db/supabase");
const uuid = require("uuid");

const insertNewNoteRecord = async (user_id, title, folder_id) => {
  const note_id = uuid.v4();
  const status = "active";
  const is_deleted = false;
  const thread_id = "";

  const active_transcript = "";
  const full_transcript = "";
  const full_markdown = "";
  const visible = "true";
  //this may not be needed... but need to make sure that this happens before play does
  const play_timestamps = [new Date()];
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

  try {
    //deactivate records
    //grabs all the notes and not just the ones that are deleted

    //send new record
    const { data: record, error: insertError } = await supabase
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

const insertNewAudioSegment = async (note_id) => {
  const segment_id = uuid.v4();
  const file_path = `${note_id}/01`;
  try {
    const { data: audioSegment, error: audioError } = await supabase
      .from("audio_segment")
      .insert({
        segment_id,
        note_id,
        sequence_num: 1,
        file_path,
      });
    if (audioError) {
      throw audioError;
    }
    return audioSegment;
  } catch (error) {
    console.error("Error in audio segment creation:", error);
    return false;
  }
};

module.exports = { insertNewNoteRecord, insertNewAudioSegment };
