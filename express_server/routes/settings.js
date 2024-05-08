const express = require("express");
const router = express.Router();
const { upload } = require("../server");
const { customNotePrompt } = require("../controllers/handleNoteExampleUpload");

router.post("/example_note", upload.single("file"), customNotePrompt);

module.exports = router;
