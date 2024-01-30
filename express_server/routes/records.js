const express = require("express");
const router = express.Router();
const {
  sendNotesFromPG,
  updateMarkdownToPG,
  updateTitleToPG,
  updateVisibilityPG,
  delNotePG,
} = require("../controllers/handleRecords");

//router.get("/tasks", sendTasks);

//change to sendNotesFromPGSoon
router.get("/notes", sendNotesFromPG);

//The actual post is send from the websocket this actual updates the DB
router.put("/notes-markdown", updateMarkdownToPG);

//UPDATE
router.put("/notes-title", updateTitleToPG);

//UPDATE (put in or out of storage)
router.put("/notes-visiblity", updateVisibilityPG);

//DELETE
router.delete("/notes", delNotePG);

module.exports = router;
