const { Paragraph, TextRun } = require("docx");
// Function to create TextRun with markdown styling
function createTextRun(text) {
  let bold = false;
  let italic = false;
  let highlight = false;

  if (text.startsWith("**") && text.endsWith("**")) {
    bold = true;
    text = text.slice(2, -2);
  } else if (text.startsWith("*") && text.endsWith("*")) {
    italic = true;
    text = text.slice(1, -1);
  } else if (text.startsWith("==") && text.endsWith("==")) {
    highlight = true;
    text = text.slice(2, -2);
  }

  return new TextRun({
    text: text,
    bold: bold,
    italics: italic,
    highlight: highlight ? { color: "yellow" } : undefined,
  });
}

// Function to parse markdown and return an array of Paragraphs
function parseMarkdownDocx(markdown) {
  const lines = markdown.split("\n");
  const docElements = [];
  let currentBullets = [];

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      // H1 Header
      docElements.push(
        new Paragraph({ text: line.slice(2), heading: "Heading1" })
      );
    } else if (line.startsWith("## ")) {
      // H2 Header
      docElements.push(
        new Paragraph({ text: line.slice(3), heading: "Heading2" })
      );
    } else if (line.startsWith("- ")) {
      // Bullet point
      currentBullets.push(line.substring(2));
    } else {
      if (currentBullets.length > 0) {
        // Add bullet points as a paragraph
        const bulletParagraphs = currentBullets.map(
          (bullet) =>
            new Paragraph({
              text: bullet,
              bullet: {
                level: 0, // Indentation level
              },
            })
        );
        docElements.push(...bulletParagraphs);
        currentBullets = [];
      }

      if (line.trim() !== "") {
        // Split the line by spaces to handle bold or italic
        const words = line.split(/(\*\*.*?\*\*|\*.*?\*)/).filter(Boolean);
        const runs = words.map((word) => createTextRun(word));

        // Add regular text as a paragraph
        docElements.push(new Paragraph({ children: runs }));
      }
    }
  });

  // In case the last lines are bullet points
  if (currentBullets.length > 0) {
    const bulletParagraphs = currentBullets.map(
      (bullet) =>
        new Paragraph({
          text: bullet,
          bullet: {
            level: 0, // Indentation level
          },
        })
    );
    docElements.push(...bulletParagraphs);
  }

  return docElements;
}

module.exports = { parseMarkdownDocx };
