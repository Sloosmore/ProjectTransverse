const pool = require("../db/db");

const readUserRecordsFromNoteID = async (note_id) => {
  const idQuery = "SELECT user_id FROM note WHERE note_id = $1";
  const idRes = await pool.query(idQuery, [note_id]);
  const user_id = idRes.rows[0].user_id;

  const readQuery = "SELECT * FROM note WHERE user_id = $1";
  const { rows } = await pool.query(readQuery, [user_id]);
  return rows;
};

const pauseAppend = async (req, res) => {
  try {
    const { id } = req.body;
    const getPauseQuery =
      "SELECT pause_timestamps FROM note WHERE note_id = $1";
    const getResult = await pool.query(getPauseQuery, [id]);
    if (!getResult.rows[0]) {
      return res.status(404).json({ message: "Note not found" });
    }
    const pauseArray = [...getResult.rows[0].pause_timestamps, new Date()];

    const updatePauseQuery =
      "UPDATE note SET pause_timestamps = $1, status = 'inactive', date_updated = NOW() WHERE note_id = $2";
    const updatePauseParam = [pauseArray, id];
    await pool.query(updatePauseQuery, updatePauseParam);

    res.status(201).json({ message: "Pause updated" });
  } catch (error) {
    console.log(`pauseAppend: ${error}`);
    res.status(500).json({ message: "An error occurred" });
  }
};

const playAppend = async (req, res) => {
  try {
    const { id } = req.body;
    const getPlayQuery = "SELECT play_timestamps FROM note WHERE note_id = $1";
    const getResult = await pool.query(getPlayQuery, [id]);
    if (!getResult.rows[0]) {
      return res.status(404).json({ message: "Note not found" });
    }
    const playArray = [...getResult.rows[0].play_timestamps, new Date()];

    const updatePlayQuery =
      "UPDATE note SET play_timestamps = $1, status = 'active', date_updated = NOW() WHERE note_id = $2";
    const updatePlayParam = [playArray, id];
    await pool.query(updatePlayQuery, updatePlayParam);

    res.status(201).json({ message: "Play updated" });
  } catch (error) {
    console.log(`playAppend: ${error}`);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { pauseAppend, playAppend };
