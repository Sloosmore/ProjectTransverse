const express = require("express");
const router = express.Router();
const { sendTasks, sendNotes } = require("../controllers/handleRecords");

router.get("/tasks", sendTasks);
router.get("/notes", sendNotes);

module.exports = router;
