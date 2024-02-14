const path = require("path");
const fsPromises = require("fs").promises;
const pool = require("../db/db");
const supabase = require("../db/supabase");
const { getUserIdFromToken } = require("../middleware/authDecodeJWS");

const writeLLM = async (req, res) => {
  try {
    console.log("writeLLM");
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    const message = req.body["instructions"];
    const frequency = req.body["frequency"];
    console.log(frequency);

    const { error } = await supabase
      .from("user")
      .update({ note_preferences: message, note_frequency: frequency })
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "all good" });
  } catch (error) {
    console.log(`Set LLM Error: ${error}`);
    res.status(500);
  }
};

const readLLM = async (req, res) => {
  try {
    console.log("ReadLLM");

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);

    const { data: message, error } = await supabase
      .from("user")
      .select("note_preferences, note_frequency")
      .eq("user_id", user_id);

    const instructions = message[0].note_preferences;
    const frequency = message[0].note_frequency;

    if (error) {
      throw error;
    }

    console.log("frequency", frequency);

    res.status(201).json({ instructions, frequency });
  } catch (error) {
    console.error(`Read LLM Error: ${error.stack}`);
    res.status(500);
  }
};

module.exports = { writeLLM, readLLM };
