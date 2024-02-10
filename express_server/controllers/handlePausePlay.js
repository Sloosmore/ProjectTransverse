const pool = require("../db/db");
const supabase = require("../db/supabase");

/*
const readUserRecordsFromNoteID = async (note_id) => {
  const idQuery = "SELECT user_id FROM note WHERE note_id = $1";
  const idRes = await pool.query(idQuery, [note_id]);
  const user_id = idRes.rows[0].user_id;

  const readQuery = "SELECT * FROM note WHERE user_id = $1";
  const { rows } = await pool.query(readQuery, [user_id]);
  return rows;
};*/

const pauseAppend = async (req, res) => {
  try {
    const { id } = req.body;
    const { data: note, error } = await supabase
      .from("note")
      .select("pause_timestamps")
      .eq("note_id", id)
      .single();
    if (error) {
      throw error;
    }
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const newDate = new Date();
    const pauseArray = [...note.pause_timestamps, newDate];

    const { error: updateError } = await supabase
      .from("note")
      .update({
        pause_timestamps: pauseArray,
        status: "inactive",
        date_updated: new Date(),
      })
      .eq("note_id", id);
    if (updateError) {
      throw updateError;
    }

    res.status(201).json({ message: "Pause updated" });
  } catch (error) {
    console.log(`pauseAppend: ${error}`);
    res.status(500).json({ message: "An error occurred" });
  }
};

const playAppend = async (req, res) => {
  try {
    const { id } = req.body;
    const { data: note, error } = await supabase
      .from("note")
      .select("play_timestamps")
      .eq("note_id", id)
      .single();
    if (error) {
      throw error;
    }
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const newDate = new Date();

    const playArray = [...note.play_timestamps, newDate];

    const { error: updateError } = await supabase
      .from("note")
      .update({
        play_timestamps: playArray,
        status: "active",
        date_updated: new Date(),
      })
      .eq("note_id", id);
    if (updateError) {
      throw updateError;
    }

    res.status(201).json({ message: "Play updated" });
  } catch (error) {
    console.log(`playAppend: ${error}`);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { pauseAppend, playAppend };
