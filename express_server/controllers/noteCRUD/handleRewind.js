const supabase = require("../../db/supabase");
const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");

require("dotenv").config();

const OpenAI = require("openai");
const openAIKey = process.env.OPENAI_KEY;
const openai = new OpenAI({ apiKey: openAIKey });

const handleRewind = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);

    const newTranscript = req.body.transcript;
    const note_id = req.body.note_id;
    console.log("note_id", note_id);
    console.log("newTranscript", newTranscript);
    console.log("user_id", user_id);

    const { data, error } = await supabase
      .from("note")
      .select("full_transcript")
      .eq("note_id", note_id);

    if (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Error fetching full transcript" });
    }

    const { data: noteData, error: noteError } = await supabase
      .from("user")
      .select("note_preferences, pref_number, note_frequency")
      .eq("user_id", user_id);

    if (noteError) {
      console.error(noteError);
      return res
        .status(500)
        .send({ message: "Error fetching note preference" });
    }
    const preArray = noteData[0].note_preferences;
    const prefNum = noteData[0].pref_number;
    const pref = preArray[prefNum];
    const freq = noteData[0].note_frequency;

    const full_transcript = data[0].full_transcript;

    const newTsLen = newTranscript?.length || 0;
    const noteTsLen = full_transcript?.length || 0;

    let promptTs;

    if (newTsLen > freq) {
      promptTs = newTranscript.slice(newTsLen - freq, newTsLen);
    } else if (noteTsLen + newTsLen < freq) {
      return res.status(400).send({ message: "Transcript is too short" });
    } else {
      const slice = freq - newTsLen;

      const newTs = full_transcript.slice(noteTsLen - slice, noteTsLen);

      promptTs = newTs + newTranscript;
    }

    const catchUp = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the best at and love summerizering transcripts in markdown. Therefore You will summerize incoming transcripts in this style: ${pref}`,
        },
        {
          role: "user",
          content: `Summerize the following partial transcript in markdown. Use your system prompt to inform your content and style of summerization. Transcript: ${promptTs}`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
    });

    console.log(
      "catchUp.choices[0].message.content:",
      catchUp.choices[0].message.content
    );

    const markdown = catchUp.choices[0].message.content;

    return res.status(200).send({ markdown });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error with OpenAI" });
  }
};

module.exports = { handleRewind };
