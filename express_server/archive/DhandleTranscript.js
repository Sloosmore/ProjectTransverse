//https://www.npmjs.com/package/chokidar
const fsPromises = require("fs").promises;
const path = require("path");
const readTranscript = require("../middleware/readTranscirpts");
const runPyTscript = require("../middleware/pyExecutable");

const handleTask = async (filePath) => {
  const filename = path.parse(filePath).name;
  console.log("checkpoint 2");
  let tscript = await readTranscript(filename);
  console.log(tscript);

  let lines = tscript.split("\n");
  const hasBlankLine = lines.some((line) => line.trim() === "");

  if (tscript.toLowerCase().includes("transverse")) {
    filePath = "../middleware/celeryQue/createDoc.py";
    runPyTscript(filePath, tscript);
    await fsPromises.writeFile(filePath, "");
  } else if (tscript.toLowerCase().includes("navigate") && hasBlankLine) {
    //gpt call
    //to navigate to another page
    await fsPromises.writeFile(filePath, "");
  } else if (tscript.toLowerCase().includes("scroll") && hasBlankLine) {
    //gpt call
    //to navigate to another page
    await fsPromises.writeFile(filePath, "");
  } else if (lines.length > 25) {
    lines = lines.slice(15);
    tscript = lines.join("\n");
    await fsPromises.writeFile(filePath, tscript);
  } else {
    console.log("waiting..");
  }
};

module.exports = handleTask;
