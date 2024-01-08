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
app.use("/tscript-api", require("./routes/tscript"));
app.use("/tverse-api", require("./routes/tverse"));
app.use("/awaitDoc-api", require("./routes/sendDoc"));
app.use("/records-api", require("./routes/records"));

//app.use("/c", require("./routes/chat"));
//will work later

app.use(errorHandler);
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
