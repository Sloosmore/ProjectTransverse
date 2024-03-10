const express = require("express");
const router = express.Router();
const {
  handleUploadAudio,
  uploadAudio,
} = require("../controllers/handleAudio");

router.post("/upload", uploadAudio, handleUploadAudio);

module.exports = router;
