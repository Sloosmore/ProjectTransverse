const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");
const supabase = require("../../db/supabase");
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
    const { data: existingSegments, error: querySegError } = await supabase
      .from("audio_segment")
      .select("*")
      .eq("note_id", noteID);

    if (querySegError) {
      throw querySegError;
    }

    const segmentLen = existingSegments.length.toString().padStart(3, "0");
    const segment_id = existingSegments[segmentLen - 1].segment_id;

    const { data: existingChunks, error: queryChunkError } = await supabase
      .from("audio_chunk")
      .select("*")
      .eq("segment_id", segment_id);

    if (queryChunkError) {
      throw queryChunkError;
    }

    // Determine the sequence number for the new chunk
    const nextSequenceNum = (existingChunks.length + 1)
      .toString()
      .padStart(3, "0");
    const filePath = `${noteID}/${segmentLen}/audio-file-${nextSequenceNum}`;
    const arrayBuffer = Uint8Array.from(audio.buffer).buffer;

    const { error: uploadError } = await supabase.storage
      .from("audio_chunks")
      .upload(filePath, arrayBuffer, { contentType: "audio/wav" });
    if (uploadError) {
      throw uploadError;
    }

    const chunk_id = uuid.v4();

    const { data, error } = await supabase.from("audio_chunk").insert({
      chunk_id: chunk_id,
      file_path: filePath,
      sequence_num: nextSequenceNum,
      segment_num: segmentLen,
      segment_id: segment_id,
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
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

module.exports = { uploadAudio, handleUploadAudio };
