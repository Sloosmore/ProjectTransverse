const express = require("express");
const router = express.Router();
const handleTscript = require("../controllers/handleTscript");

router.post("/", handleTscript.handleTscript);

module.exports = router;
