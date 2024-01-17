const path = require("path");
const fsPromises = require("fs").promises;

const filePath = path.join(__dirname, "../files/settings/LLMconfig.txt");

const writeLLM = async (req, res) => {
  try {
    console.log("writeLLM");
    const message = req.body["instructions"];
    await fsPromises.writeFile(filePath, message);
    res.status(201).json({ message: "all good" });
  } catch (error) {
    console.log(`Set LLM Error: ${error}`);
    res.status(500);
  }
};

const readLLM = async (req, res) => {
  try {
    console.log("ReadLLM");
    const instructions = await fsPromises.readFile(filePath, "utf8");
    console.log(instructions);
    res.status(201).json({ instructions });
  } catch (error) {
    console.log(`Read LLM Error: ${error}`);
    res.status(500);
  }
};

module.exports = { writeLLM, readLLM };
