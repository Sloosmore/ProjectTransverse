const path = require("path");
const fsPromises = require("fs").promises;
const pool = require("../db/db");

const user_id = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

const writeLLM = async (req, res) => {
  try {
    console.log("writeLLM");
    const message = req.body["instructions"];
    await pool.query(
      `UPDATE "user" SET note_preferences = $1 WHERE user_id = $2`,
      [message, user_id]
    );

    res.status(201).json({ message: "all good" });
  } catch (error) {
    console.log(`Set LLM Error: ${error}`);
    res.status(500);
  }
};

const readLLM = async (req, res) => {
  try {
    console.log("ReadLLM");

    const { rows } = await pool.query(
      'SELECT note_preferences FROM "user" WHERE user_id = $1',
      [user_id]
    );
    const instructions = rows[0].note_preferences;
    res.status(201).json({ instructions });
  } catch (error) {
    console.error(`Read LLM Error: ${error.stack}`);
    res.status(500);
  }
};

module.exports = { writeLLM, readLLM };
