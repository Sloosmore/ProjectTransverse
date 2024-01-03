//https://www.npmjs.com/package/chokidar
const fsPromises = require("fs").promises;
const path = require("path");

const handleTask = async (filePath) => {
  const dbPath = path.join(__dirname, "..", "db/fileRecords");
  try {
    const data = await fsPromises.readFile(dbPath, "utf-8");
    // serverPath: db/filename.ext
    // genPath

    const file_data = JSON.parse(data);
    const record = file_data["records"].find(
      (element) => element["file"] === filePath
    );
    // Do something with record
  } catch (err) {
    console.error(err);
  }
};

module.exports = handleTask;
