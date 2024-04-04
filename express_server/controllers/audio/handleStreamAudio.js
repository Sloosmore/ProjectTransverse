const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");
const supabase = require("../../db/supabase");
const { response } = require("express");

const streamAudio = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    const noteID = req.query.noteID;
    console.log("noteID", noteID);

    // Read segments from note instead of chunks

    const { data: segments, error: querySegError } = await supabase
      .from("audio_segment")
      .select("file_path, sequence_num, duration, end_time")
      .eq("note_id", noteID)
      .order("sequence_num", { ascending: true });

    if (querySegError) {
      throw querySegError;
    }

    const filePaths = segments.map((segment) => segment.file_path);

    let segURLData, segURLerror;

    try {
      const response = await supabase.storage
        .from("audio_segments")
        .createSignedUrls(filePaths, 60 ** 3);
      segURLData = response.data;
      segURLerror = response.error;
    } catch (error) {
      console.error("Error in createSignedUrls:", error);
    }

    //send list of segment Urls along with timestamps in an object
    // [{url: "url", time: "time differential"}]
    const urls = segURLData.map((url) => url.signedUrl);
    const durations = segments.map((segment) => segment.duration);
    const endTimes = segments.map((segment) => segment.end_time);

    const segData = urls.map((url, index) => {
      return {
        url: url,
        duration: durations[index],
        end_time: endTimes[index],
      };
    });

    res
      .status(200)
      .json({ message: "Audio streaming successful", segData: segData });
  } catch (error) {
    console.error("Error in streamAudio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { streamAudio };

/*
    const { data: audioChunks, error: queryError } = await supabase
      .from("audio_chunk")
      .select("file_path")
      .eq("note_id", noteID)
      .order("sequence_num", { ascending: true });

    if (queryError) {
      throw queryError;
    }
    if (audioChunks.length === 0) {
      console.error("No audio found for note");
      return res.status(404).json({ message: "No audio found for note" });
    }

    const filePaths = audioChunks.map((chunk) => chunk.file_path);

    // Stream each chunk
    const { data, error } = await supabase.storage
      .from("audio_chunks")
      .createSignedUrls(filePaths, 60 ** 3);
 */
