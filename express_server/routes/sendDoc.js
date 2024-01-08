const express = require("express");
const router = express.Router();
const handleDocSend = require("../controllers/handleDocSend");

router.get("/", handleDocSend.handleDocSend);

module.exports = router;
