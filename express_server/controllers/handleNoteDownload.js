const pool = require("../db/db");
const { marked } = require("marked");
const puppeteer = require("puppeteer");
const { parseMarkdownDocx } = require("../middleware/download/docx");
const { Document, Packer } = require("docx");
const downloadNote = async (req, res) => {
  try {
    const { noteID, format } = req.body;
    console.log(`This is the format: ${format}`);

    const queryMD = "SELECT full_markdown FROM note WHERE note_id = $1";
    const { rows } = await pool.query(queryMD, [noteID]);
    const md = rows[0].full_markdown;

    // Convert ==highlighted text== to appropriate format
    const customMarkdown = md.replace(/==(.+?)==/g, (match, p1) => {
      if (format === "PDF") {
        // For PDF, convert to HTML with a span tag
        return `<span class="highlight">${p1}</span>`;
      } else if (format === "Word") {
        // For Word, return the text as is; formatting will be handled later
        return p1;
      }
      return match;
    });
    if (format === "PDF") {
      // Convert Markdown to HTML
      console.log(customMarkdown);
      const html = marked(customMarkdown);
      console.log(html);

      // Define CSS for highlighting

      // Inject CSS into HTML

      // Convert HTML to PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      await page.addStyleTag({
        content: `
        body { font-family: 'Arial'; }
        .highlight { background-color: yellow; -webkit-print-color-adjust: exact; }`,
      });
      const pdf = await page.pdf({
        format: "A4",
        margin: {
          top: ".75in",
          right: "1in",
          bottom: "1in",
          left: "1in",
        },
      });
      // Send PDF as response
      res.contentType("application/pdf");
      console.log("sending pdf...");
      res.send(pdf);
    } else if (format === "Word") {
      // Create a new Word document
      const docSections = processMarkdown(customMarkdown);

      // Create the document with the processed sections
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docSections,
          },
        ],
      });

      // Generate a Word document buffer
      const buffer = await Packer.toBuffer(doc);

      // Send the document
      res.contentType(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      console.log("sending pdf...");
      res.send(buffer);
    }
  } catch (error) {
    console.error(error.stack);
    res.status(500).send("Error generating document");
  }
};

module.exports = { downloadNote };
