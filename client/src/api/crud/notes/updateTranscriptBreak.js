import { supabaseClient } from "@/config/supabaseClient";
import { appendFullTranscript } from "./updateTranscript";

export const breakTranscript = async (note_id, lastTS) => {
  /**
   * Puts an identifyer in the transcript JSON letting a new section be known
   * Particalty helpful for speaker idetification breaks
   *
   * Need a max speaker because idetification is not concurrent between end of sessions
   */
  try {
    if (lastTS) {
      await appendFullTranscript(note_id, lastTS);
    }

    const { data, error } = await supabaseClient
      .from("note")
      .select("json_transcript")
      .eq("note_id", note_id)
      .single();

    const full_Ts = Array.isArray(data.json_transcript)
      ? data.json_transcript
      : [];
    console.log("full_Ts", full_Ts);
    //plus one because it makes sense to start at new len
    //you could add one in the other side but needs an edge case for 0
    const maxSpeaker =
      full_Ts.length > 0
        ? Math.max(...full_Ts.map((obj) => obj.speaker || 0)) + 1
        : 1;

    //perform transcript update
    const update = {
      speaker: null,
      caption: null,
      id: null,
      name: null,
      break: true,
      maxSpeaker,
    };

    const updatedTranscript = [...full_Ts, update];

    //wrtie back to DB

    const result = await supabaseClient
      .from("note")
      .update({ json_transcript: updatedTranscript, date_updated: new Date() })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
