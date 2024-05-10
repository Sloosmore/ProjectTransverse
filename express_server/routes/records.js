const express = require("express");
const router = express.Router();
const {
  sendNotesFromSB,
  updateMarkdownToSB,
  updateTitleToSB,
  delNoteSB,
  upInactiveStatus,
} = require("../controllers/noteCRUD/handleRecords");
const { upload } = require("../server");

const { uploadSlides } = require("../controllers/noteCRUD/handleSlideUpload");

const {
  pauseAppend,
  playAppend,
} = require("../controllers/noteCRUD/handlePausePlay");

const { downloadNote } = require("../controllers/handleNoteDownload");

const { uploadMDImage } = require("../controllers/noteCRUD/handleImgUp");

const { handleRewind } = require("../controllers/noteCRUD/handleRewind");

//router.get("/tasks", sendTasks);

//change to
router.get("/notes", sendNotesFromSB);

//UPDATE MD JSON
router.put("/notes-markdown", updateMarkdownToSB);

//UPDATE Image
router.post("/notes-image", upload.single("file"), uploadMDImage);

//UPDATE Statis
router.put("/notes-deactivate", upInactiveStatus);

//UPDATE Title
router.put("/notes-title", updateTitleToSB);

//UPDATE Play
router.put("/notes-play", playAppend);

//UPDATE Pause
router.put("/notes-pause", pauseAppend);

//DELETE
router.delete("/notes", delNoteSB);

//POST Download MD
router.post("/notes-download", downloadNote);

// POST upload slides
router.post("/upload-slides", upload.single("file"), uploadSlides);

// POST rewind
router.post("/rewind", handleRewind);

module.exports = router;
