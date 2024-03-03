const express = require("express");
const router = express.Router();
const { writeLLM, readLLM } = require("../controllers/handleNoteConfig");
const { upload } = require("../server");
const { customNotePrompt } = require("../controllers/handleNoteUpload");

router.post("/notes", writeLLM);
router.get("/notes", readLLM);
router.post("/example_note", upload.single("file"), customNotePrompt);

module.exports = router;
