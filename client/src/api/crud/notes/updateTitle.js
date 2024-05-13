import { supabaseClient } from "@/config/supabaseClient";

export const updateTitle = async (note_id, title) => {
  /*
   * Updates title of notes
   */
  if (note_id) {
    try {
      const result = await supabaseClient
        .from("note")
        .update({ title: title, date_updated: new Date() })
        .eq("note_id", note_id);
      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
