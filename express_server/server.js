const express = require("express");
const app = express();
const { logEvents, logger } = require("./middleware/infoTracking/logEvents");
const errorHandler = require("./middleware/infoTracking/errorHandle");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

const corsOrigins = process.env.CORS_ORIGINS.split(",");
app.use(
  cors({
    origin: corsOrigins,
  })
);

app.use(logger);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For parsing application/json
app.use(express.json());
app.use("/", require("./routes/root"));
app.use("/tscript-api", require("./routes/tscript"));

//put in GET req for notes data
app.use("/records-api", require("./routes/records"));
app.use("/settings", require("./routes/settings"));

//Web socket for notes
//----------------------------------------------------------------------
const WebSocket = require("ws");
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  console.log("WS connection upgraded");
  if (request.url === "/notes-api") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

const { handleWebSocketConnection } = require("./controllers/handleNoteWS");

wss.on("connection", handleWebSocketConnection);
//----------------------------------------------------------------------

app.use(errorHandler);
server.listen(PORT, () => console.log(`server started on port ${PORT}`));
