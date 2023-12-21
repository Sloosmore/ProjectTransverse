let { PythonShell } = require("python-shell");
const path = require("path");

runPyTscript = async (transcriptID) => {
  let options = {
    scriptPath: path.join(__dirname, ".."),
    args: [transcriptID],
  };

  let textFragment = await PythonShell.run(
    "transcription.py",
    options,
    (err, results) => {
      if (err) console.log(err)
      console.log("results:", results);
      return results;
    }
  );

  console.log(textFragment);

  return textFragment;
};

module.exports = runPyTscript;
