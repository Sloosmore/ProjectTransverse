export const applyMarkdown = (formatType, markdown, setMarkdown) => {
  const textarea = document.getElementById("exampleFormControlTextarea1");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  let selectedText = markdown.substring(start, end);

  let markdownSyntax;
  switch (formatType) {
    case "bold":
      markdownSyntax = `**${selectedText}**`;
      break;
    case "italic":
      markdownSyntax = `*${selectedText}*`;
      break;
    case "code":
      markdownSyntax = `\`${selectedText}\``;
      break;
    case "highlight":
      markdownSyntax = `==${selectedText}==`;
      break;
    case "clear":
      const syntaxes = ["**", "*", "`", "=="];
      syntaxes.forEach((syntax) => {
        while (
          selectedText.startsWith(syntax) &&
          selectedText.endsWith(syntax)
        ) {
          selectedText = selectedText.substring(
            syntax.length,
            selectedText.length - syntax.length
          );
        }
      });
      markdownSyntax = selectedText;
      break;
    default:
      markdownSyntax = selectedText;
  }

  const newMarkdown =
    markdown.substring(0, start) + markdownSyntax + markdown.substring(end);
  setMarkdown(newMarkdown);

  // Optional: Reset the selection to the end of the newly formatted text
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd =
      start + markdownSyntax.length;
  }, 0);
};
