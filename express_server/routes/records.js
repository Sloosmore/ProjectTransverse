const express = require("express");
const router = express.Router();
const {
  sendTasks,
  sendNotes,
  saveToPG,
} = require("../controllers/handleRecords");

router.get("/tasks", sendTasks);

//change to sendNotesFromPGSoon
router.get("/notes", sendNotes);
router.post("/notes", saveToPG);

module.exports = router;
