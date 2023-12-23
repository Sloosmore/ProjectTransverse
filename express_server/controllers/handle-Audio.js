const fsPromises = require("fs").promises;
const path = require("path");
const uuid = require("uuid");

//middleware imports
const delAudio = require("../middleware/audio/deleteAudio");
const appendTranscript = require("../middleware/audio/appendTranscript");
const readTranscript = require("../middleware/readTranscirpts");
const runPyTscript = require("../middleware/audio/pythonTranscription");
const timerAppend = require("../middleware/addTimer");

const handleAudio = async (req, res) => {
  try {
    //time
    let startfin = Date.now();

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

      //these are all async functions
      textFragment = await runPyTscript(transcriptID);

      delAudio(transcriptID);

      //IMPORTANT: file structure of reading txt file will need to be upgraded from one txt file later
      //filepath to write should be a var

      // >99.9% of the response time is the translation
      await appendTranscript(textFragment, "test");

      let tscript = await readTranscript("test");

      //time
      timerAppend(startfin, true);

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
