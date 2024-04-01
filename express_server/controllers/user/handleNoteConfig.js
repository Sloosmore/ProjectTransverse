const fsPromises = require("fs").promises;
const supabase = require("../../db/supabase");
const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");

const writeLLM = async (req, res) => {
  try {
    console.log("writeLLM");
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    const message = req.body["instructions"];
    const frequency = req.body["frequency"];
    const pref_num = req.body["pref_num"];

    const note_pref_num = pref_num["note"];
    const diagram_pref_numb = pref_num["diagram"];
    const note_pref = message["note"];
    const diagram_pref = message["diagram"];

    console.log("note", note_pref);
    console.log("diagram", diagram_pref);

    try {
      const { error } = await supabase
        .from("user")
        .update({
          note_preferences: note_pref,
          note_frequency: frequency,
          pref_number: note_pref_num,
          diagram_preferences: diagram_pref,
          diagram_pref_number: diagram_pref_numb,
        })
        .eq("user_id", user_id);
      console.log("error", error);
    } catch (error) {
      console.log(`Set LLM Error: ${error}`);
      res.status(500).json({ message: "An error occurred" });
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
      .select(
        "note_preferences, note_frequency, pref_number, diagram_preferences, diagram_pref_number"
      )
      .eq("user_id", user_id);

    const instructions = message[0].note_preferences;
    const frequency = message[0].note_frequency;
    const pref_num = message[0].pref_number;
    const diagram_instructions = message[0].diagram_preferences;
    const diagram_pref_numb = message[0].diagram_pref_number;

    if (error) {
      throw error;
    }

    res.status(201).json({
      instructions,
      frequency,
      pref_num,
      diagram_instructions,
      diagram_pref_numb,
    });
  } catch (error) {
    console.error(`Read LLM Error: ${error.stack}`);
    res.status(500);
  }
};

module.exports = { writeLLM, readLLM };
