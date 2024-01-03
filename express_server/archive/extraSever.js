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
    console.log("checkpoint");
    await handleTask(path);
  })
  .on("unlink", (path) => {}); //to be done later

//-------------------------------------------------------
