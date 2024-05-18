import { supabaseClient } from "@/config/supabaseClient";

export const updateFolder = async (note_id, folder_id) => {
  /*
   * Updates title of notes
   */
  console.log("in update folder");
  if (note_id) {
    try {
      const result = await supabaseClient
        .from("note")
        .update({ folder_id: folder_id, date_updated: new Date() })
        .eq("note_id", note_id);
      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
