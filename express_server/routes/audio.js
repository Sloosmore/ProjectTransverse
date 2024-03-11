const express = require("express");
const router = express.Router();
const {
  handleUploadAudio,
  uploadAudio,
} = require("../controllers/audio/handleUpAudio");

router.post("/upload", uploadAudio, handleUploadAudio);

module.exports = router;
