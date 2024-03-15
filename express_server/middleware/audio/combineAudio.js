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

  ffmpeg.stderr.on("data", (data) => {
    console.error(`FFmpeg error: ${data}`);
  });

  ffmpeg.on("error", (error) => {
    console.error(`Error spawning FFmpeg: ${error.message}`);
    passThrough.end();
  });

  ffmpeg.on("close", (code) => {
    if (code !== 0) {
      console.error(`FFmpeg exited with code ${code}`);
      passThrough.end();
    }
  });

  const { data, error } = await supabase.storage
    .from("full_audio")
    .upload(file_path, passThrough, {
      contentType: "audio/wav",
      duplex: "half",
      upsert: true,
    });

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
