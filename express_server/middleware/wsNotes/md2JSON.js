const marked = require("marked");

function markdownToTiptap(markdown) {
  const tokens = marked.lexer(markdown);
  return tokensToTiptap(tokens);
}

function tokensToTiptap(tokens) {
  const result = [];
  let currentListItems = [];

  for (const token of tokens) {
    switch (token.type) {
      case "paragraph":
        result.push({
          type: "paragraph",
          content: textToTiptap(token.text),
        });
        break;
      case "heading":
        result.push({
          type: "heading",
          attrs: { level: token.depth },
          content: textToTiptap(token.text),
        });
        break;
      case "list_start":
        currentListItems = [];
        break;
      case "list_end":
        result.push({
          type: "bulletList",
          attrs: { tight: true },
          content: currentListItems,
        });
        break;
      case "list_item_start":
        break;
      case "list_item_end":
        break;
      case "text":
        currentListItems.push({
          type: "listItem",
          content: [{ type: "paragraph", content: textToTiptap(token.text) }],
        });
        break;
      // Additional cases for other elements...
    }
  }

  return { type: "doc", content: result };
}

function textToTiptap(text) {
  // This function should be expanded to properly parse inline Markdown formatting
  // such as bold and italics. For simplicity, it's treating text as plain here.
  return [{ type: "text", text: text }];
}

function combineTiptapObjects(obj1, obj2) {
  // Check if both objects are non-existent
  if (!obj1 && !obj2) {
    return null;
  }

  // If one of the objects is non-existent, return the other
  if (!obj1) {
    return obj2;
  }
  if (!obj2) {
    return obj1;
  }

  // Assuming both objects have a 'content' array
  return {
    type: "doc",
    content: [...obj1.content, ...obj2.content],
  };
}

module.exports = { markdownToTiptap, tokensToTiptap, combineTiptapObjects };
