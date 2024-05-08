import { supabaseClient } from "@/config/supabaseClient";

export const toggleGen = async (note_id, note_toggle, diagram_toggle) => {
  console.log("updating test");
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

/*

- Original
export const toggleGen = async (note_id, note_toggle, diagram_toggle) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-toggleGen`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id,
        diagram_gen_on: diagram_toggle,
        note_gen_on: note_toggle,
      }),
    }
  );
  const data = await response.json();
  return data.noteRecords;
};

- DB function
import { supabaseClient } from "@/config/supabaseClient";

const toggleGeneration = async (req, res) => {
  const { note_id, diagram_gen_on, note_gen_on } = req.body;

  const { error: updateError } = await supabase
    .from("note")
    .update({
      date_updated: new Date(),
      diagram_gen_on: diagram_gen_on,
      note_gen_on: note_gen_on,
    })
    .eq("note_id", note_id);
  if (updateError) {
    throw updateError;
  }
  res.status(200).json({ message: `all good` });
};

module.exports = { toggleGeneration };
*/
