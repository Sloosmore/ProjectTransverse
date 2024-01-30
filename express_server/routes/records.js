const express = require("express");
const router = express.Router();
const {
  sendTasks,
  sendNotes,
  sendNotesFromPG,
  saveToPG,
} = require("../controllers/handleRecords");

//router.get("/tasks", sendTasks);

//change to sendNotesFromPGSoon
router.get("/notes", sendNotesFromPG);
router.post("/notes", saveToPG);

module.exports = router;
