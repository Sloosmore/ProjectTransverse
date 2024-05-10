import { supabaseClient } from "@/config/supabaseClient";

export const toggleGen = async (note_id, note_toggle, diagram_toggle) => {
  /*
   * Turns on & off generations in notes
   */

  const { error: updateError } = await supabaseClient
    .from("note")
    .update({
      date_updated: new Date(),
      diagram_gen_on: diagram_toggle,
      note_gen_on: note_toggle,
    })
    .eq("note_id", note_id);
  if (updateError) {
    throw updateError;
  }
};
