const pool = require("../db/db");

const pauseAppend = async (req, res) => {
  try {
    const { id } = req.body;
    const getPauseQuery =
      "SELECT pause_timestamps FROM note WHERE note_id = $1";
    const getResult = await pool.query(getPauseQuery, [id]);
    const pauseArray = getResult.rows[0].pause_timestamps;
    const date = new Date();
    pauseArray.push(date);

    const updatePauseQuery =
      "UPDATE note SET pause_timestamps = $1 WHERE note_id = $2";
    const updatePauseParam = [pauseArray, id];
    const upRestult = await pool.query(updatePauseQuery, updatePauseParam);
  } catch (error) {
    console.log(`pauseAppend: ${error}`);
    res.status(500);
  }
};

const playAppend = async (req, res) => {
  try {
    const { id } = req.body;
    const getPlayQuery = "SELECT play_timestamps FROM note WHERE note_id = $1";
    const getResult = await pool.query(getPlayQuery, [id]);
    const playArray = getResult.rows[0].play_timestamps;
    const date = new Date();
    playArray.push(date);

    const updatePlayQuery =
      "UPDATE note SET play_timestamps = $1 WHERE note_id = $2";
    const updatePlayParam = [playArray, id];
    const upRestult = await pool.query(updatePlayQuery, updatePlayParam);
  } catch (error) {
    console.log(`pauseAppend: ${error}`);
    res.status(500);
  }
};

module.exports = { pauseAppend, playAppend };
