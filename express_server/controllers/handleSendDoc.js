const path = require("path");
const fs = require("fs");
const libre = require("libreoffice-convert");

const sendDoc = (req, res) => {
  const filename = req.query.filename;
  filepath = path.join(__dirname, `../files/docs/${filename}`);

  fs.readFile(filepath, (err, fileContent) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      res.sendStatus(500);
      return;
    }

    // Convert the Buffer
    libre.convert(fileContent, ".pdf", undefined, (err, done) => {
      if (err) {
        console.error(`Error converting file: ${err}`);
        res.sendStatus(500);
        return;
      }

      // Here `done` is pdf file (Buffer)
      const pdfBuffer = done;
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdfBuffer);
    });
  });
};

module.exports = { sendDoc };
