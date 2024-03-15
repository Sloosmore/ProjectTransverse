const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");
const supabase = require("../../db/supabase");
const multer = require("multer");
const upload = multer();
const uuid = require("uuid");

const uploadAudio = upload.fields([
  { name: "noteID", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);
{
  /*
async function sendRequestToLambda(note_path, chunk_path) {
  const apiGatewayUrl =
    "https://lzo59sva7l.execute-api.us-east-2.amazonaws.com/default/combine_audio";
  const data = {
    note_audio_path: note_path,
    chunk_audio_path: chunk_path,
  };

  try {
    const response = await axios.post(apiGatewayUrl, data);
    console.log("Response from Lambda:", response.data);
    // Handle the response as needed

    return response.data;
  } catch (error) {
    console.error("Error calling Lambda:", error);
    // Handle the error as needed
  }
}*/
}

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

    //deturmine the sequence number for the sequence
    const { data: existingChunks, error: queryChunkError } = await supabase
      .from("audio_segment")
      .select("*")
      .eq("note_id", noteID);

    if (queryChunkError) {
      throw queryChunkError;
    }

    const length = existingChunks.length.toString().padStart(2, "0");
    console.log("current note length", length);
    const arrayBuffer = Uint8Array.from(audio.buffer).buffer;
    const filePath = `${noteID}/${length.padStart(2, "0")}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("audio_segments")
        .upload(filePath, arrayBuffer, {
          contentType: "audio/wav",
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) {
        throw uploadError;
      }
    } catch (error) {
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

/*    const { data: existingSegments, error: querySegError } = await supabase
      .from("audio_segment")
      .select("*")
      .eq("note_id", noteID);

    if (querySegError) {
      throw querySegError;
    }

    const segmentLen = existingSegments.length.toString().padStart(3, "0");
    const segment_id = existingSegments[segmentLen - 1].segment_id;
    */

/*
    // Determine the sequence number for the new chunk
    const nextSequenceNum = (existingChunks.length + 1)
      .toString()
      .padStart(3, "0");
    
    */
/*  
    const chunk_id = uuid.v4();

    const { data, error } = await supabase.from("audio_chunk").insert({
      chunk_id: chunk_id,
      file_path: filePath,
      sequence_num: nextSequenceNum,
      note_id: noteID,
    });
    {
         segment_num: segmentLen,
    segment_id: segment_id,
    }*/
//send to lamda function to process audio
//const wholeAudioPath = `${noteID}_audio.wav`;
/*
    let lambdaResponse;
    if (existingChunks.length === 0) {
      try {
        const { error: uploadError } = await supabase.storage
          .from("full_audio")
          .upload(wholeAudioPath, arrayBuffer, { contentType: "audio/wav" });
      } catch (error) {
        throw error;
      }
    } else {
      try {
        {
                  lambdaResponse = await sendRequestToLambda(wholeAudioPath, filePath);
           
        }
      } catch (error) {
        throw error;
      }
    }
    if (error) {
      throw error;
    }
    */
