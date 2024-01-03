const runPy = require("../middleware/pyExecutable");
const record = require("../middleware/writeTaskDB");
const uuid = require("uuid");

const handleTverse = async (req, res) => {
  try {
    tscript = req.body["transcript"];

    //add
    ID = uuid.v4();
    record(tscript, ID);

    tscript = req.body["transcript"];
    consol.log(tscript);
    pyPath = "celeryQue/tverseExecutable.py";

    pyArg = [tscript, ID];
    await runPy(pyPath, pyArg);

    res.status(201).json({ message: "Recieved", ID: ID });
  } catch {
    res.status(500).json({ message: "Server is on fire" });
  }
};

module.exports = { handleTverse };
