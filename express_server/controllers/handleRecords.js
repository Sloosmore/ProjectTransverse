const path = require("path");
const fsPromises = require("fs").promises;

const sendTasks = async (req, res) => {
  try {
    console.log("Reading file...");
    const filepath = path.join(__dirname, "../../db/fileRecords.json");
    const data = await fsPromises.readFile(filepath, "utf8");
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    res.status(201).json(parsedData);
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { sendTasks };
