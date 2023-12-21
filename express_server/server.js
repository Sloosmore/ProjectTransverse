const express = require("express");
const app = express();
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandle");

const PORT = process.env.PORT || 5001;

app.use(logger);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For parsing application/json
app.use(express.json());

app.use("/", require("./routes/root"));
app.use("/v-api", require("./routes/voice"));

//app.use("/c", require("./routes/chat"));
//will work on in a sec

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.use(errorHandler);

app.listen(PORT, () => console.log("server started on port 5001"));
