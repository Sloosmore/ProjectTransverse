const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");
const supabase = require("../../db/supabase");
const ffmpeg = require("fluent-ffmpeg");

const streamAudio = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    const noteID = req.params.noteID;

    const { data: audioChunks, error: queryError } = await supabase
      .from("audio_chunk")
      .select("file_path")
      .eq("note_id", noteID)
      .order("sequence_num", { ascending: true });

    if (queryError) {
      throw queryError;
    }

    if (audioChunks.length === 0) {
      return res.status(404).json({ message: "No audio found for note" });
    }

    const startTime = parseInt(req.query.startTime) || 0;

    // Calculate which chunk to start with (assuming 30 sec per chunk)
    const startChunkIndex = Math.floor(startTime / 30);

    // TODO: Calculate byte range if necessary for partial content

    res.writeHead(200, {
      "Content-Type": "audio/wav",
      // Additional headers if partial content
    });

    // Stream starting from the calculated chunk
    let isLastChunk = false;
    for (let i = startChunkIndex; i < audioChunks.length; i++) {
      // Stream each chunk
      if (i === audioChunks.length - 1) {
        isLastChunk = true;
      }
      await streamAudioChunk(audioChunks[i].file_path, res, isLastChunk);
    }

    async function streamAudioChunk(filePath, res, isLastChunk) {
      try {
        const { data, error } = await supabase.storage
          .from("audio_chunks")
          .download(filePath);

        if (error) {
          throw error;
        }

        data.pipe(res, { end: false });
        await new Promise((resolve) =>
          data.on("end", () => {
            if (isLastChunk) {
              res.end(); // End the response after the last chunk
            }
            resolve();
          })
        );
      } catch (error) {
        console.error("Error streaming chunk:", error);
      }
    }
  } catch (error) {
    console.error("Error in streamAudio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { streamAudio };
