function markdownToTiptap(markdown) {
  const lines = markdown.split("\n");
  const result = [];
  let listStack = [];
  let currentList = null;
  let currentIndentLevel = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const indentLevel = (line.length - trimmedLine.length) / 2;

    if (trimmedLine.startsWith("## ")) {
      closeAllLists();
      addHeading(trimmedLine.slice(3), 2);
    } else if (trimmedLine.startsWith("- ")) {
      const indentLevel = (line.length - trimmedLine.length) / 2;
      adjustListStack(indentLevel);
      addListItem(trimmedLine.slice(2));
    } else if (trimmedLine !== "") {
      closeAllLists();
      addParagraph(trimmedLine);
    }
  }

  closeAllLists();

  function adjustListStack(indentLevel) {
    if (indentLevel > currentIndentLevel) {
      startList();
    } else if (indentLevel < currentIndentLevel) {
      endList();
    }
    currentIndentLevel = indentLevel;
  }

  function addHeading(text, level) {
    result.push({
      type: "heading",
      attrs: { level },
      content: [{ type: "text", text }],
    });
  }

  function startList() {
    const newList = {
      type: "bulletList",
      attrs: { tight: true },
      content: [],
    };

    if (currentList) {
      const lastItem = getLastItem(currentList);
      lastItem.content.push(newList);
    } else {
      result.push(newList);
    }

    listStack.push(newList);
    currentList = newList;
  }

  function endList() {
    listStack.pop();
    currentList = listStack[listStack.length - 1] || null;
  }

  function closeAllLists() {
    while (listStack.length > 0) {
      listStack.pop();
    }
    currentList = null;
  }

  function addListItem(text) {
    const listItem = {
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    };

    if (!currentList) {
      startList();
    }

    currentList.content.push(listItem);
  }

  function getLastItem(list) {
    if (!list.content.length) {
      list.content.push({ type: "listItem", content: [] });
    }
    return list.content[list.content.length - 1];
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
