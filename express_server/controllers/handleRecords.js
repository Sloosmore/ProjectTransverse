const pool = require("../db/db");

const id = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

const sendNotesFromPG = async (req, res) => {
  try {
    console.log("Fetching records...");
    const result = await pool.query(
      "SELECT * FROM note WHERE visible = true AND user_id = $1",
      [id]
    );
    const noteRecords = result.rows.map((record) => {
      return {
        ...record,
        status: "inactive",
      };
    });
    console.log("Sending records...");
    res.status(201).json({ noteRecords });
  } catch (error) {
    console.error("Error:", error);
  }
};

const saveToPG = async (req, res) => {
  try {
    const { id, markdown } = req.body;
    console.log("Saving to DB...");
    console.log(`${markdown}`);
    const saveQuery =
      "UPDATE note SET full_markdown = $1, date_updated = NOW() WHERE note_id = $2";
    const saveQueryParams = [markdown, id];
    const result = await pool.query(saveQuery, saveQueryParams);
    res.status(201).json({ message: "saved" });
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { sendNotesFromPG, saveToPG };
