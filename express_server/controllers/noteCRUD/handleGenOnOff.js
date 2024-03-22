const supabase = require("../../db/supabase");

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
