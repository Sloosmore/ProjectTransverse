const fsPromises = require("fs").promises;
const path = require("path");

readTranscript = async (filename) => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, "../..", "/files/transcripts", `${filename}.txt`),
      "utf8"
    );
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
  }
};

module.exports = readTranscript;
