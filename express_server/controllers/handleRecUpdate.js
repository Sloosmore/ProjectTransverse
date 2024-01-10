//https://www.npmjs.com/package/chokidar
const fsPromises = require("fs").promises;
const path = require("path");
const { send } = require("process");
const chokidar = require("chokidar");

const handleDocSend = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendSSE = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // serverPath: ./files/doc/filename.ext
    // genPath './files/docs/{parse_title(output)}'
    console.log(req.query);
    const ID = req.query.ID;
    console.log(ID);

    const filepath = path.join(__dirname, "../../db/fileRecords.json");
    const watcher = chokidar.watch(filepath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    watcher.on("change", async (path) => {
      console.log("change");
      let data = await fsPromises.readFile(filepath, "utf-8");
      const file_data = JSON.parse(data);
      const record = file_data["records"].find(
        (element) => element["task_id"] === ID
      );
      console.log(`here is the record: ${JSON.stringify(record, null, 2)}`);

      let recordValues = Object.values(record);
      let falsyValues = recordValues.filter((value) => !value);
      if (falsyValues.length === 0) {
        sendSSE(JSON.stringify(record));
        watcher.close();
        res.end();
      } else {
        console.log("somehing wenttttttttttt wrong");
      }
    });

    req.on("close", () => {
      watcher.close(); // Close the watcher when the client disconnects
      res.end(); // End the SSE connection
    });

    // Do something with record
  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleDocSend };

//const dbPath = path.join(__dirname, "..", "../db/fileRecords");
//const;
