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
    let customMarkdown = md;
    if (format === "PDF") {
      customMarkdown = md.replace(/==(.+?)==/g, (match, p1) => {
        // For PDF, convert to HTML with a span tag
        return `<span class="highlight">${p1}</span>`;
      });
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
    } else if (format === "docx") {
      // Create a new Word document
      const docSections = parseMarkdownDocx(customMarkdown);

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
      res.attachment("file.docx");
      console.log("sending pdf...");
      res.send(buffer);
    }
  } catch (error) {
    console.error(error.stack);
    res.status(500).send("Error generating document");
  }
};

module.exports = { downloadNote };
