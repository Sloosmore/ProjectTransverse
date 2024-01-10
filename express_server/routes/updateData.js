const express = require("express");
const router = express.Router();
const handleDocSend = require("../controllers/handleRecUpdate");

router.get("/", handleDocSend.handleDocSend);

module.exports = router;
