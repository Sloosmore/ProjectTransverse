import { supabaseClient } from "@/config/supabaseClient";

export const appendFullTranscript = async (id, newTsChunk) => {
  try {
    /**
     * Appends a new chunk of transcript to the existing transcript of a note in the database.
     *
     * @param {string} id - The ID of the note to update.
     * @param {string|object} newTsChunk - The new chunk of transcript to append. If this is a string, it will be appended to the 'full_transcript' of the note. If it is an object, it will be concatenated to the 'json_transcript' of the note.
     * @returns {string|object|boolean} - Returns the updated transcript if the operation was successful, or false if there was an error or if the note was not found.
     * @throws Will throw an error if the database operation fails.
     */
    //---------------------------

    const transcriptProperty =
      typeof newTsChunk === "string" ? "full_transcript" : "json_transcript";

    if (
      id &&
      ((transcriptProperty === "full_transcript" && newTsChunk.lenght > 0) ||
        transcriptProperty === "json_transcript") &&
      Array.isArray(newTsChunk) &&
      newTsChunk.length > 0
    ) {
      const { data: note, error } = await supabaseClient
        .from("note")
        .select(transcriptProperty)
        .eq("note_id", id)
        .single();
      if (error) {
        throw error;
      }
      if (!note) {
        console.error(`appendFullTranscript Note with ID ${id} not found`);
        return false;
      }
      /*
    console.log(`newTsChunk (${typeof newTsChunk}):`, newTsChunk);
    console.log(
      `note[transcriptProperty] (${typeof note[transcriptProperty]}):`,
      note[transcriptProperty]
    );*/

      const newfullTs =
        typeof newTsChunk === "string"
          ? note[transcriptProperty] + newTsChunk
          : note[transcriptProperty].concat(newTsChunk);

      //combine both the new ts and the old TS
      //this should seperate each new section

      //console.log(`--------------${JSON.stringify(newfullTs)}--------------`);

      const { error: updateError } = await supabaseClient
        .from("note")
        .update({ [transcriptProperty]: newfullTs, date_updated: new Date() })
        .eq("note_id", id);
      if (updateError) {
        throw updateError;
      }

      return newfullTs;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    console.error("Error message:", error.message);
    return false;
  }
};
