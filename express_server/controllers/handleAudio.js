const { getUserIdFromToken } = require("../middleware/authDecodeJWS");
const supabase = require("../db/supabase");
const multer = require("multer");
const upload = multer();
const uuid = require("uuid");

const uploadAudio = upload.fields([
  { name: "noteID", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

const handleUploadAudio = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    console.log("user_id", user_id);
    const noteID = req.body.noteID;
    console.log("noteID", noteID);
    const audio = req.files.audio[0];

    if (!audio || !audio.buffer) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    const { data: existingChunks, error: queryError } = await supabase
      .from("audio_chunk")
      .select("*")
      .eq("note_id", noteID);

    if (queryError) {
      throw queryError;
    }

    // Determine the sequence number for the new chunk
    const nextSequenceNum = existingChunks.length + 1;

    const filePath = `${noteID}/audio-file-${nextSequenceNum}`;
    const arrayBuffer = Uint8Array.from(audio.buffer).buffer;

    const { error: uploadError } = await supabase.storage
      .from("audio_chunks")
      .upload(filePath, arrayBuffer, { contentType: "audio/wav" });
    if (uploadError) {
      throw uploadError;
    }

    const chunk_id = uuid.v4();

    const { data, error } = await supabase.from("audio_chunk").insert({
      note_id: noteID,
      chunk_id: chunk_id,
      file_path: filePath,
      sequence_num: nextSequenceNum,
      user_id: user_id,
    });

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "all good" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Upload Audio Error: ${error}`);
      console.log(error.stack);
    } else {
      console.log("Caught an exception that was not an Error object:", error);
    }
    res.status(500);
  }
};

module.exports = { uploadAudio, handleUploadAudio };
