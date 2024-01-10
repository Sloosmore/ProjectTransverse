const express = require("express");
const app = express();
const { logEvents, logger } = require("./middleware/infoTracking/logEvents");
const errorHandler = require("./middleware/infoTracking/errorHandle");
const http = require("http");
const server = http.createServer(app);

const chokidar = require("chokidar");
const PORT = process.env.PORT || 5001;

app.use(logger);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For parsing application/json
app.use(express.json());

app.use("/", require("./routes/root"));
app.use("/tscript-api", require("./routes/tscript"));
app.use("/tverse-api", require("./routes/tverse"));
app.use("/awaitDoc-api", require("./routes/updateData"));
app.use("/records-api", require("./routes/records"));
app.use("/grabDoc-api", require("./routes/sendDoc"));

//Web socket for notes
//----------------------------------------------------------------------
const WebSocket = require("ws");
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  console.log("Parsing session from request...");
  if (request.url === "/notes-api") {
    console.log("here");
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

//const {handleWebSocketConnection} = require('./controllers/handleNoteWS')

//wss.on('connection', handleWebSocketConnection);
//----------------------------------------------------------------------

app.use(errorHandler);
server.listen(PORT, () => console.log(`server started on port ${PORT}`));
