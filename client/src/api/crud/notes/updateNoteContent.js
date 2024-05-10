import { supabaseClient } from "@/config/supabaseClient";

export const saveNoteMarkdown = async (note_id, markdown, json_content) => {
  /*
   * Save markdown to db
   */

  try {
    const result = await supabaseClient
      .from("note")
      .update({
        full_markdown: markdown,
        date_updated: new Date(),
        json_content: json_content,
      })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    console.error("Save markdown error error:", error);
  }
};
