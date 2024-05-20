const express = require("express");
const router = express.Router();
const { upload } = require("../server");
const { customNotePrompt } = require("../controllers/handleNoteExampleUpload");
const { adminCode } = require("../controllers/handleCodeCheck");

router.post("/example_note", upload.single("file"), customNotePrompt);

router.post("/adminCode", adminCode);

module.exports = router;
