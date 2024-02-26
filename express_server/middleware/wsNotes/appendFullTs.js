const pool = require("../../db/db");
const supabase = require("../../db/supabase");

//this function should take in the new ts and ID
//and then read the full transcript

const appendFullTranscript = async (id, newTsChunk) => {
  //grab full TS from DB
  try {
    const { data: note, error } = await supabase
      .from("note")
      .select("full_transcript")
      .eq("note_id", id)
      .single();
    if (error) {
      throw error;
    }
    if (!note) {
      console.error(`appendFullTranscript Note with ID ${id} not found`);
      return false;
    }
    const newfullTs = note.full_transcript + newTsChunk;

    //combine both the new ts and the old TS
    //this should seperate each new section
    const { error: updateError } = await supabase
      .from("note")
      .update({ full_transcript: newfullTs, date_updated: new Date() })
      .eq("note_id", id);
    if (updateError) {
      throw updateError;
    }

    return newfullTs;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
};

module.exports = { appendFullTranscript };
