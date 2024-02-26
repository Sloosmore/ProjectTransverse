const pool = require("../../db/db");
const supabase = require("../../db/supabase");

const fetchActiveTs = async (id, incomingTs) => {
  try {
    const { data: note, error } = await supabase
      .from("note")
      .select("active_transcript")
      .eq("note_id", id)
      .single();
    if (error) {
      throw error;
    }
    if (!note) {
      console.error(`fetchActiveTs Note with ID ${id} not found`);
      return false;
    }
    const activeTS = note.active_transcript + incomingTs;

    const { error: updateError } = await supabase
      .from("note")
      .update({ active_transcript: activeTS, date_updated: new Date() })
      .eq("note_id", id);
    if (updateError) {
      throw updateError;
    }

    return activeTS;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
};

const clearActiveTS = async (id) => {
  try {
    const { data, error } = await supabase
      .from("note")
      .update({ active_transcript: "", date_updated: new Date() })
      .eq("note_id", id);
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      console.log(data);
      console.error(`clearActiveTS Note with ID ${id} not found`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { fetchActiveTs, clearActiveTS };
