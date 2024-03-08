const express = require("express");
const router = express.Router();
const {
  sendNotesFromSB,
  updateMarkdownToSB,
  updateTitleToSB,
  updateVisibilitySB,
  delNoteSB,
  upInactiveStatus,
  sendFoldersFromSB,
  postFolderToSB,
  upFolderTitleToSB,
  delFolder,
} = require("../controllers/handleRecords");

const { pauseAppend, playAppend } = require("../controllers/handlePausePlay");

const { downloadNote } = require("../controllers/handleNoteDownload");

//router.get("/tasks", sendTasks);

//change to
router.get("/notes", sendNotesFromSB);

//GET folder
router.get("/folders", sendFoldersFromSB);

//POST folder
router.post("/folders", postFolderToSB);

//UPDATE folder title
router.post("/folder-title", upFolderTitleToSB);

//DELETE folder
router.delete("/folders", delFolder);

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
