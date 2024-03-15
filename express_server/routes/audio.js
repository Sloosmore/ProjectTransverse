const express = require("express");
const router = express.Router();
const {
  handleUploadAudio,
  uploadAudio,
} = require("../controllers/audio/handleUpAudio");

const { streamAudio } = require("../controllers/audio/handleStreamAudio");

router.post("/upload", uploadAudio, handleUploadAudio);

router.get("/stream", streamAudio);

module.exports = router;
