const pool = require("../db/db");

const downloadNote = async (req, res) => {
  const { noteID, format } = res.body;
  const queryMD = "SELECT full_markdown FROM note WHERE note_id = $1";
  const { rows } = await pool.query(queryMD, [noteID]);
  const md = rows[0].full_markdown;

  // Convert ==highlighted text== to HTML with custom span
  const customMarkdown = markdown.replace(
    /==(.+?)==/g,
    '<span class="highlight">$1</span>'
  );

  // Convert Custom Markdown to HTML
  const html = marked(customMarkdown);

  // Define CSS for highlighting
  const css = `<style>.highlight { background-color: yellow; }</style>`;

  // Inject CSS into HTML
  const finalHtml = css + html;

  if (format === "pdf") {
    // Convert HTML to PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(finalHtml);
    const pdf = await page.pdf({ format: "A4" });

    res.contentType("application/pdf");
    res.send(pdf);
  } else if (format === "word") {
    // Convert HTML to Word
    const docx = htmlDocx.asBlob(finalHtml);

    res.contentType(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(docx);
  }
};
