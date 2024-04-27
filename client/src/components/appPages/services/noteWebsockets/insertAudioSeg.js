import { supabaseClient } from "@/config/supabaseClient";
import { v4 as uuid } from "uuid";

const insertNewAudioSegment = async (note_id) => {
  const segment_id = uuid();
  const file_path = `${note_id}/01`;
  try {
    const { data: audioSegment, error: audioError } = await supabaseClient
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

export default insertNewAudioSegment;
