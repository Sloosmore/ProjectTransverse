const fs = require("fs");
const path = require("path");

function delAudio(ID) {
  fs.unlink(
    path.join(__dirname, "../../files/audiologs", `${ID}.webm`),
    (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log(`${ID} has been deleted`);
      }
    }
  );
}

module.exports = delAudio;
