const express = require("express");
const router = express.Router();
const handleRecords = require("../controllers/handleRecords");

router.get("/", handleRecords.sendTasks);

module.exports = router;
