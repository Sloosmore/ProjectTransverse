import { supabaseClient } from "@/config/supabaseClient";

export const deleteRecord = async (note_id) => {
  /*
   * Deletes Note From DB
   */

  try {
    const result = await supabaseClient
      .from("note")
      .update({ is_deleted: true })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    res.sendStatus(401);
  }
};
