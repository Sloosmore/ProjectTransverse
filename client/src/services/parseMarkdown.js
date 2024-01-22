export function bifurcateMarkdown(markdown) {
  const match = markdown.match(/^(# .*$)\n([\s\S]*)/m);
  if (match) {
    const title = match[1];
    const body = match[2];
    return [title, body];
  } else {
    return [markdown, ""];
  }
}

export const splitMarkdown = (markdownText) => {
  // Split by two new lines for paragraphs or one new line for lines
  return markdownText.split("\n\n");
};

export function convertMarkdownToText(markdown) {
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
}
