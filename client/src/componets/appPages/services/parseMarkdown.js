export function bifurcateMarkdown(markdown) {
  // Improved Regular Expression
  const match = markdown.match(/^(#\s?.*)\n([\s\S]*)/);

  if (match) {
    const title = match[1].trim();
    const body = match[2].trim();

    return [title, body];
  } else {
    return ["", markdown.trim()];
  }
}

export const splitMarkdown = (markdownText) => {
  // First, try splitting by two new lines (paragraphs)
  if (markdownText) {
    const splitByParagraphs = markdownText.split("\n\n");

    // Check if the text was split into more than one part
    if (splitByParagraphs.length > 2) {
      console.log("split by paragraph");
      console.log(splitByParagraphs);
      return splitByParagraphs;
    }

    // If not, fallback to splitting by '##' (level-2 headings)
    const markdown = markdownText
      .split("##")
      .map((part) => part.trim())
      .filter((part) => part !== "");

    return markdown;
  } else {
    return [];
  }
};

export function convertMarkdownToText(markdown) {
  if (markdown) {
    let text = markdown.replace(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g,
      ""
    );

    // Replace headers
    text = text.replace(/(#+\s?)/g, "");

    // Replace bold text
    text = text.replace(/\*\*(.*?)\*\*/g, "$1");

    // Replace italic text
    text = text.replace(/__(.*?)__/g, "$1");
    text = text.replace(/\*(.*?)\*/g, "$1");

    // Replace unordered lists
    text = text.replace(/^\s*-\s*/gm, "");

    // Add a period at the end of lines that don't end with one
    text = text
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (
          line &&
          !line.endsWith(".") &&
          !line.endsWith("?") &&
          !line.endsWith("!")
        ) {
          return line + ".";
        }
        return line;
      })
      .join("\n");

    // Replace multiple newlines with a single newline
    text = text.replace(/\n\s*\n/g, "\n\n");

    // Optional: Replace line breaks with spaces or specific character if needed
    text = text.replace(/\n/g, " ");

    return text;
  } else {
    return "";
  }
}
