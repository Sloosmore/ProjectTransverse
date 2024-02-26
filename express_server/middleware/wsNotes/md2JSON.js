function markdownToTiptap(markdown) {
  const lines = markdown.split("\n");
  const result = [];
  let currentListItems = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inList) {
        endList();
      }
      addHeading(line.slice(3), 2);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        startList();
      }
      addListItem(line.slice(2));
    } else if (line.trim() !== "") {
      if (inList) {
        endList();
      }
      addParagraph(line);
    }
  }

  if (inList) {
    endList();
  }

  function addHeading(text, level) {
    result.push({
      type: "heading",
      attrs: { level },
      content: [{ type: "text", text }],
    });
  }

  function startList() {
    inList = true;
    currentListItems = [];
  }

  function endList() {
    result.push({
      type: "bulletList",
      attrs: { tight: true },
      content: currentListItems,
    });
    inList = false;
  }

  function addListItem(text) {
    currentListItems.push({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    });
  }

  function addParagraph(text) {
    result.push({
      type: "paragraph",
      content: [{ type: "text", text }],
    });
  }

  return { type: "doc", content: result };
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

module.exports = { markdownToTiptap, combineTiptapObjects };
