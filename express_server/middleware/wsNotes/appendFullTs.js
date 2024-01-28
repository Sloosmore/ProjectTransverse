const pool = require("../../db/db");

//this function should take in the new ts and ID
//and then read the full transcript

const appendFullTranscript = async (id, newTsChunk) => {
  //grab full TS from DB
  let fullTs = "";
  const matchIDQueryFull =
    "Select full_transcript FROM note WHERE note_id = ($1)";
  const matchedRecordFull = [id];
  try {
    const res = await pool.query(matchIDQueryFull, matchedRecordFull);
    if (res.rows.length === 0) {
      console.error(`Note with ID ${id} not found`);
      return false;
    }
    fullTs = res.rows[0].full_transcript;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }

  //combine both the new ts and the old TS
  const newfullTs = fullTs + newTsChunk;
  const reWriteFTS = "UPDATE note SET full_transcript = $1 WHERE note_id = $2";
  const reWriteTSParam = [newfullTs, id];

  try {
    await pool.query(reWriteFTS, reWriteTSParam);
    return newfullTs;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { appendFullTranscript };
