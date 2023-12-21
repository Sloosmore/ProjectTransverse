const fsPromises = require("fs").promises;
const path = require("path");

appendTranscript = async (text, transcriptName) => {
  const appendTranscript = async (text, transcriptName) => {
    try {
      await fsPromises.appendFile(
        path.join(
          __dirname,
          "../..",
          "/files/transcripts",
          `${transcriptName}.txt`
        ),
        text
      );
    } catch (err) {
      console.error("Error appending to file:", err);
    }
  };

  module.exports = appendTranscript;
};

module.exports = appendTranscript;
