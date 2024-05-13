const pool = require("../../../db/db");
const supabase = require("../../../db/supabase");

//this function should take in the new ts and ID
//and then read the full transcript

const appendFullTranscript = async (id, newTsChunk) => {
  /**
   * Appends a new transcript chunk to the full transcript of a specific note in the database.
   *
   * @async
   * @function appendFullTranscript
   * @param {string} id - The ID of the note to update.
   * @param {string} newTsChunk - The new transcript chunk to append to the full transcript.
   * @returns {Promise<string|boolean>} The updated full transcript if successful, or `false` if an error occurred or the note was not found.
   * @throws Will throw an error if the database operation fails.
   *
   * @example
   * appendFullTranscript('note123', 'This is a new transcript chunk.')
   *   .then(updatedTranscript => console.log(updatedTranscript))
   *   .catch(error => console.error(error));
   */

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

    const newfullTs =
      typeof newTsChunk === "string"
        ? note.full_transcript + newTsChunk
        : [...note.full_transcript, ...newTsChunk];

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
