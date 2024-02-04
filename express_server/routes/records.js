const express = require("express");
const router = express.Router();
const {
  sendNotesFromSB,
  updateMarkdownToSB,
  updateTitleToSB,
  updateVisibilitySB,
  delNoteSB,
  upInactiveStatus,
} = require("../controllers/handleRecords");

const { pauseAppend, playAppend } = require("../controllers/handlePausePlay");

const { downloadNote } = require("../controllers/handleNoteDownload");

//router.get("/tasks", sendTasks);

//change to sendNotesFromPGSoon
router.get("/notes", sendNotesFromSB);

//UPDATE MD
router.put("/notes-markdown", updateMarkdownToSB);

//UPDATE Statis
router.put("/notes-deactivate", upInactiveStatus);

//UPDATE Title
router.put("/notes-title", updateTitleToSB);

//UPDATE Vis
router.put("/notes-visiblity", updateVisibilitySB);

//UPDATE Play
router.put("/notes-play", playAppend);

//UPDATE Pause
router.put("/notes-pause", pauseAppend);

//DELETE
router.delete("/notes", delNoteSB);

//POST Download MD
router.post("/notes-download", downloadNote);

module.exports = router;
