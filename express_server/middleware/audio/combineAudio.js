const { spawn } = require("child_process");
const supabase = require("../../db/supabase");
const { PassThrough } = require("stream");

// Function to concatenate and upload audio
async function concatenateAndUpload(urls, file_path) {
  const ffmpegArgs = [
    "-i",
    `concat:${urls.join("|")}`,
    "-acodec",
    "pcm_s16le",
    "-ar",
    "44100",
    "-ac",
    "2",
    "-f",
    "wav",
    "pipe:1",
  ];
  const ffmpeg = spawn("ffmpeg", ffmpegArgs);

  const passThrough = new PassThrough();
  ffmpeg.stdout.pipe(passThrough);

  const { data, error } = await supabase.storage
    .from("audio_segments")
    .upload(file_path, passThrough);

  if (error) {
    throw error;
  }

  return data;
}

// Main function to process URLs
async function processAudioFiles(urls, file_path) {
  try {
    const uploadedFile = await concatenateAndUpload(urls, file_path);
    console.log("File uploaded:", uploadedFile);
  } catch (error) {
    console.error("Error processing audio files:", error);
  }
}

module.exports = { processAudioFiles };
