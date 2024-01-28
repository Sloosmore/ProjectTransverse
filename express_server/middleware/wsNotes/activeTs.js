const pool = require("../../db/db");

const fetchActiveTs = async (id, incomingTs) => {
  let activeTS = "";
  const matchIDQueryActive =
    "Select active_transcript FROM note WHERE note_id = ($1)";
  const matchedRecordActive = [id];

  try {
    const res = await pool.query(matchIDQueryActive, matchedRecordActive);
    if (res.rows.length === 0) {
      console.error(`Note with ID ${id} not found`);
      return false;
    }
    activeTS = res.rows[0].active_transcript;
    activeTS = activeTS + incomingTs;
  } catch (error) {
    console.error(`Error: ${error}`);
    false;
  }

  const updateATS =
    "UPDATE note SET active_transcript = $1, date_updated = NOW() WHERE note_id = $2";
  const updateATSParam = [activeTS, id];

  try {
    await pool.query(updateATS, updateATSParam);
    return activeTS;
  } catch (err) {
    console.error(err);
    return false;
  }
  //write to Active TS
};

const clearActiveTS = async (id) => {
  const clearATS =
    "UPDATE note SET active_transcript = $1, date_updated = NOW() WHERE note_id = $2";
  const clearATSParam = ["", id];

  try {
    const res = await pool.query(clearATS, clearATSParam);
    if (res.rowCount === 0) {
      console.error(`Note with ID ${id} not found`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { fetchActiveTs, clearActiveTS };
