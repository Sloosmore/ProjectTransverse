const express = require("express");
const router = express.Router();
const handleTverse = require("../controllers/handleTverse");

router.post("/", handleTverse.handleTverse);

module.exports = router;
