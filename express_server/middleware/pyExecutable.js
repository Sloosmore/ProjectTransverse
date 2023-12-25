let { PythonShell } = require("python-shell");
const path = require("path");

runPyTscript = async (Filepath, pyArg) => {
  let options = {
    scriptPath: path.join(__dirname),
    args: [pyArg],
  };


  let textFragment = await PythonShell.run(
    Filepath,
    options,
    (err, results) => {
      if (err) console.log(err);
      console.log("results:", results);
      return results;
    }
  );


};

module.exports = runPyTscript;
