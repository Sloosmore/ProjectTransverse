const express = require("express");
const router = express.Router();
const { writeLLM, readLLM } = require("../controllers/user/handleNoteConfig");
const { upload } = require("../server");
const { customNotePrompt } = require("../controllers/handleNoteExampleUpload");
const { handleTipTapAuth } = require("../controllers/user/handleTipTapAuth");

router.post("/notes", writeLLM);
router.get("/notes", readLLM);
router.post("/example_note", upload.single("file"), customNotePrompt);
router.post("/tiptapAuth", handleTipTapAuth);

module.exports = router;
