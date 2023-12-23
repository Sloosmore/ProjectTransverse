//https://www.npmjs.com/package/chokidar
const fsPromises = require("fs").promises;
const path = require("path");
const fs = require("fs");
const readTranscript = require("../middleware/readTranscirpts");
const chokidar = require("chokidar");

const handleTask = async (filePath) => {
  const filename = path.parse(filePath).name;
  let tscript = await readTranscript(filename);

  let lines = tscript.split("\n");
  while (lines.length > 25) {
    lines.shift();
  }
  tscript = lines.join("\n");

  const hasBlankLine = lines.some((line) => line.trim() === "");

  if (tscript.toLowerCase().includes("transcript")) {
    //to cell task que
    await fsPromises.writeFile(filePath, "");
  } else if (tscript.toLowerCase().includes("navigate") && hasBlankLine) {
    //gpt call
    //to navigate to another page
    await fsPromises.writeFile(filePath, "");
  } else if (tscript.toLowerCase().includes("scroll") && hasBlankLine) {
    //gpt call
    //to navigate to another page
    await fsPromises.writeFile(filePath, "");
  } else {
    await fsPromises.writeFile(filePath, tscript);
  }
};

module.exports = handleTask;
