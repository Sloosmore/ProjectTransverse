const express = require("express");
const router = express.Router();
const {
  handleUploadAudio,
  uploadAudio,
} = require("../controllers/audio/handleUpAudio");
const { deepgramAPI } = require("../controllers/audio/handleDeepgram");

const { streamAudio } = require("../controllers/audio/handleStreamAudio");

router.post("/upload", uploadAudio, handleUploadAudio);

router.get("/stream", streamAudio);

router.get("/deepgram", deepgramAPI);

module.exports = router;
