const pool = require("../db/db");
const supabase = require("../db/supabase");

const { marked } = require("marked");
const puppeteer = require("puppeteer");
const { parseMarkdownDocx } = require("../middleware/download/docx");
const { generateHTML } = require("@tiptap/html");

const Document = require("@tiptap/extension-document").default;
const Paragraph = require("@tiptap/extension-paragraph").default;
const Text = require("@tiptap/extension-text").default;
const Bold = require("@tiptap/extension-bold").default;
const Italic = require("@tiptap/extension-italic").default;
const Code = require("@tiptap/extension-code").default;
const CodeBlock = require("@tiptap/extension-code-block").default;
const ListItem = require("@tiptap/extension-list-item").default;
const BulletList = require("@tiptap/extension-bullet-list").default;
const OrderedList = require("@tiptap/extension-ordered-list").default;
const HardBreak = require("@tiptap/extension-hard-break").default;
const TextAlign = require("@tiptap/extension-text-align").default;
const History = require("@tiptap/extension-history").default;
const Highlight = require("@tiptap/extension-highlight").default;
const Heading = require("@tiptap/extension-heading").default;
const Strike = require("@tiptap/extension-strike").default;
const Underline = require("@tiptap/extension-underline").default;
const TaskItem = require("@tiptap/extension-task-item").default;
const TaskList = require("@tiptap/extension-task-list").default;

const extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Code,
  CodeBlock,
  ListItem,
  BulletList,
  OrderedList,
  HardBreak,
  TextAlign,
  History,
  Highlight,
  Heading,
  Strike,
  Underline,
  TaskItem,
  TaskList,
];

const HTMLtoDOCX = require("html-to-docx");

const downloadNote = async (req, res) => {
  try {
    const { noteID, format } = req.body;

    console.log(`This is the format: ${format}`);
    console.log(`This is the noteID: ${noteID}`);
    const { data: mdResult, error } = await supabase
      .from("note")
      .select("json_content")
      .eq("note_id", noteID);

    if (error) {
      throw error;
    }
    const jsonContent = mdResult[0].json_content;
    const html = generateHTML(jsonContent, extensions);

    //const md = mdResult[0].full_markdown;

    // Convert ==highlighted text== to appropriate format
    if (format === "PDF") {
      // Define CSS for highlighting

      // Inject CSS into HTML

      // Convert HTML to PDF
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
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
      ////https://www.npmjs.com/package/html-to-docx
      // Create a new Word document

      //const docSections = parseMarkdownDocx(customMarkdown);

      // Create the document with the processed sections
      /*
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docSections,
          },
        ],
      });
      */

      // Generate a Word document buffer
      const fileBuffer = await HTMLtoDOCX(html, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });

      // Send the document
      res.contentType(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.attachment("file.docx");
      console.log("sending docx...");
      res.send(fileBuffer);
    }
  } catch (error) {
    console.error(error.stack);
    res.status(500).send("Error generating document");
  }
};

module.exports = { downloadNote };
