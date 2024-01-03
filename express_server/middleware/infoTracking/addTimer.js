const fsPromises = require("fs").promises;
const path = require("path");

timerAppend = async (startTime, endLine) => {
  if (typeof endLine !== "boolean") {
    throw new Error("Invalid argument: endLine must be a boolean");
  }
  let filePath = path.join(__dirname, "../..", "logs/timer.csv");

  let timeDiff = Date.now() - startTime
  if (endLine === false) await fsPromises.appendFile(filePath, `${timeDiff},`);
  else await fsPromises.appendFile(filePath, `${timeDiff},\n`);
};

module.exports = timerAppend;
