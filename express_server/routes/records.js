const express = require("express");
const router = express.Router();
const {
  sendNotesFromPG,
  updateMarkdownToPG,
  updateTitleToPG,
  updateVisibilityPG,
  delNotePG,
} = require("../controllers/handleRecords");

const { pauseAppend, playAppend } = require("../controllers/handlePausePlay");

const { downloadNote } = require("../controllers/handleNoteDownload");

//router.get("/tasks", sendTasks);

//change to sendNotesFromPGSoon
router.get("/notes", sendNotesFromPG);

//UPDATE MD
router.put("/notes-markdown", updateMarkdownToPG);

//UPDATE Title
router.put("/notes-title", updateTitleToPG);

//UPDATE Vis
router.put("/notes-visiblity", updateVisibilityPG);

//UPDATE Play
router.put("/notes-play", playAppend);

//UPDATE Pause
router.put("/notes-pause", pauseAppend);

//DELETE
router.delete("/notes", delNotePG);

//POST Download MD
router.post("/notes-download", downloadNote);

module.exports = router;
