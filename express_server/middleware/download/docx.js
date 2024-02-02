const { Paragraph, TextRun, ShadingType } = require("docx");

// Function to create TextRun with markdown styling
function createTextRun(text) {
  let bold = false;
  let italic = false;
  let shading = null;
  let highlight = null;

  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;
  const shadingRegex = /==(.+?)==/g;

  if (boldRegex.test(text)) {
    bold = true;
    text = text.replace(boldRegex, "$1");
  }
  if (italicRegex.test(text)) {
    italic = true;
    text = text.replace(italicRegex, "$1");
  }
  if (shadingRegex.test(text)) {
    shading = {
      type: ShadingType.CLEAR,
      color: "000000",
      fill: "FFFF00",
    };
    text = text.replace(shadingRegex, "$1");
    //highlight = "FFFF00";
  }

  return new TextRun({
    text: text,
    bold: bold,
    italics: italic,
    highlight: highlight,
    shading: shading,
  });
}

// Function to parse markdown and return an array of Paragraphs
function parseMarkdownDocx(markdown) {
  const lines = markdown.split("\n");
  const docElements = [];
  let inBulletList = false;
  let bulletText = "";

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      // H1 Header
      addBulletParagraph();
      docElements.push(
        new Paragraph({ text: line.slice(2), heading: "Heading1" })
      );
    } else if (line.startsWith("## ")) {
      // H2 Header
      addBulletParagraph();
      docElements.push(
        new Paragraph({ text: line.slice(3), heading: "Heading2" })
      );
    } else if (line.startsWith("- ")) {
      // Bullet point
      addBulletParagraph();
      bulletText = line.substring(2);
      inBulletList = true;
    } else if (inBulletList && line.trim() !== "") {
      // Continue bullet point in the next line
      bulletText += "\n" + line;
    } else {
      // Regular text
      addBulletParagraph();
      processFormattedText(line);
    }
  });

  // Add any remaining bullet point
  addBulletParagraph();

  function processFormattedText(text) {
    const runs = text
      .split(/(\*\*.*?\*\*|\*.*?\*|==.*?==)/)
      .filter(Boolean)
      .map((word) => createTextRun(word));
    docElements.push(new Paragraph({ children: runs }));
  }

  function addBulletParagraph() {
    if (inBulletList && bulletText.trim() !== "") {
      const bulletRuns = bulletText
        .split(/(\*\*.*?\*\*|\*.*?\*|==.*?==)/)
        .filter(Boolean)
        .map((word) => createTextRun(word));
      docElements.push(
        new Paragraph({
          children: bulletRuns,
          bullet: {
            level: 0,
          },
        })
      );
      bulletText = "";
      inBulletList = false;
    }
  }

  return docElements;
}

module.exports = { parseMarkdownDocx };
