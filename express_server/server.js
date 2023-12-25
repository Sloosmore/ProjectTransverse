const express = require("express");
const app = express();
const { logEvents, logger } = require("./middleware/infoTracking/logEvents");
const errorHandler = require("./middleware/infoTracking/errorHandle");
const path = require("path");

const chokidar = require("chokidar");
const PORT = process.env.PORT || 5001;

app.use(logger);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For parsing application/json
app.use(express.json());

app.use("/", require("./routes/root"));
app.use("/v-api", require("./routes/voice"));

//app.use("/c", require("./routes/chat"));
//will work later

app.use(errorHandler);
app.listen(PORT, () => console.log(`server started on port ${PORT}`));

// NL Handeler ------------------------------------------

const handleTask = require("./controllers/handleTask");

const filepath = path.join(__dirname, "files/transcripts/");

const watcher = chokidar.watch(filepath, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

watcher
  .on("add", (path) => {}) //to be done later
  .on("change", async (path) => {
    await handleTask(path);
  })
  .on("unlink", (path) => {}); //to be done later

//-------------------------------------------------------
