const express = require("express");
const router = express.Router();
const { writeLLM, readLLM } = require("../controllers/handleNoteConfig");

router.post("/notes", writeLLM);
router.get("/notes", readLLM);

module.exports = router;
