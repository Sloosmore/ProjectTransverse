const express = require("express");
const router = express.Router();
const sendDoc = require("../controllers/handleSendDoc");

router.get("/", sendDoc.sendDoc);

module.exports = router;
