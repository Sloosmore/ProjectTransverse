const runPy = require("../middleware/pyExecutable");
const { record } = require("../middleware/writeTaskDB");
const uuid = require("uuid");

const handleTverse = async (req, res) => {
  try {
    let tscript = req.body["transcript"];
    //add
    let ID = uuid.v4();
    let initRecord = await record(tscript, ID);

    console.log(tscript);
    pyPath = "celeryQue/tverseExecutable.py";

    pyArg = [tscript, ID];

    runPy(pyPath, pyArg);
    res.status(201).json(initRecord);
  } catch {
    res.status(500).json({ message: "Server is on fire" });
  }
};

module.exports = { handleTverse };
