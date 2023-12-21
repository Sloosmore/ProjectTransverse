const express = require("express");
const router = express.Router();
const handleAudio = require("../controllers/handle-Audio");

//this will need to grab the task from the database and put them on the sidebar
//Router.get("/", (req, res) => {});

//this will be the route to send chat audio to the database
router.post("/", handleAudio.handleAudio);

module.exports = router;
