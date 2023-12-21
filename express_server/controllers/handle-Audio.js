const fsPromises = require("fs").promises;
const path = require("path");
const uuid = require("uuid");
let { PythonShell } = require("python-shell");
const delAudio = require("../middleware/audio/deleteAudio");
const appendTranscript = require("../middleware/audio/appendTranscript");

const handleAudio = async (req, res) => {
  try {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const audioData = Buffer.concat(chunks);
      const transcriptID = uuid.v4();
      const filePath = path.join(
        __dirname,
        "..",
        "/files/audiologs",
        `${transcriptID}.webm`
      );

      //WRITE FILE
      await fsPromises.writeFile(filePath, audioData);

      // send filepath to pythonscript
      let options = {
        scriptPath: path.join(__dirname, "..", "middleware"),
        args: [transcriptID],
      };

      textFragment = await PythonShell.run("transcription.py", options).then(
        (results) => {
          console.log("results:", results);
          return results;
        }
      );

      //IMPORTANT: file structure of reading txt file will need to be upgraded from one txt file later
      //filepath to write should be a var

      //these are all async functions
      appendTranscript(textFragment, "test");
      delAudio(transcriptID);
      tscript = readTranscript("test");

      console.log("Audio file saved successfully");
      res.status(200).json({
        message: "Audio file saved successfully",
        transcript: tscript,
      });
    });
  } catch (error) {
    console.error("Error saving audio file:", error);
    res.status(500).send("Error saving audio file");
  }
};
module.exports = { handleAudio };
