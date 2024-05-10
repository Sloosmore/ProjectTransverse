import { supabaseClient } from "@/config/supabaseClient";

export const fetchNoteRecords = async (session, deactivate) => {
  /**
   * Grabs the note from the table.
   *
   * @param {Object} session - The session object.
   * @param {Boolean} deactivate - To deactive or not to deactivate.
   * @returns {Promise<Array>} The note records.
   */

  const user_id = session.user.id;

  try {
    let result;
    if (deactivate) {
      const { error: updateError } = await supabaseClient
        .from("note")
        .update({ status: "inactive" })
        .eq("user_id", user_id);
    }

    result = await supabaseClient
      .from("note")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_deleted", false);

    console.log("Sending records...");

    return result.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
