const uuid = require("uuid");
const {
  diagramRecord2DB,
  mermaid2SVG,
  svg2PNG,
  diagram2Storage,
} = require("./diagramGen");

const markdownToTiptap = async (markdown, note_id) => {
  const lines = markdown.split("\n");
  const result = [];
  let listStack = [];
  let currentList = null;
  let currentIndentLevel = 0;

  let isMermaidBlock = false;
  let mermaidContent = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    const indentLevel = (line.length - trimmedLine.length) / 2;

    if (trimmedLine.startsWith("```mermaid")) {
      isMermaidBlock = true;
      mermaidContent = "";
      closeAllLists();
      continue;
    } else if (isMermaidBlock && trimmedLine.startsWith("```")) {
      isMermaidBlock = false;
      let diagram_id = uuid.v4();
      console.log("note_id", note_id);
      const file_path = `${note_id}/${diagram_id}`;

      const success = await diagramRecord2DB(
        note_id,
        diagram_id,
        file_path,
        mermaidContent
      );
      if (!success) {
        console.log(`failed uploading ${file_path} `);
      }

      const svg = await mermaid2SVG(mermaidContent, file_path, diagram_id);
      const buffer = await svg2PNG(svg);
      const img_url = await diagram2Storage(file_path, buffer);
      addDiagram(img_url, "description");

      //push img to tiptap stack
      continue;
    } else if (isMermaidBlock) {
      mermaidContent += line + "\n";
    }
    if (trimmedLine.startsWith("#### ")) {
      closeAllLists();
      addHeading(trimmedLine.slice(5), 4);
    } else if (trimmedLine.startsWith("### ")) {
      closeAllLists();
      addHeading(trimmedLine.slice(4), 3);
    } else if (trimmedLine.startsWith("## ")) {
      closeAllLists();
      addHeading(trimmedLine.slice(3), 2);
    } else if (trimmedLine.startsWith("# ")) {
      closeAllLists();
      addHeading(trimmedLine.slice(2), 1);
    } else if (trimmedLine.startsWith("- ")) {
      const indentLevel = (line.length - trimmedLine.length) / 2;
      adjustListStack(indentLevel);
      addListItem(trimmedLine.slice(2));
    } else if (trimmedLine !== "" && !isMermaidBlock) {
      closeAllLists();
      addParagraph(trimmedLine);
    }
  }

  closeAllLists();

  function parseTextStyle(text) {
    const nodes = [];
    let currentIndex = 0;

    const addTextNode = (text, marks = []) => {
      if (text) {
        nodes.push({ type: "text", text, marks });
      }
    };

    const findNextMatch = (text) => {
      const boldMatch = text.match(/\*\*(.*?)\*\*/);
      const italicMatch = text.match(/\*(.*?)\*/);

      if (!boldMatch && !italicMatch) return null;

      if (boldMatch && (!italicMatch || boldMatch.index <= italicMatch.index)) {
        return { match: boldMatch, type: "bold" };
      } else {
        return { match: italicMatch, type: "italic" };
      }
    };

    while (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      const nextMatch = findNextMatch(remainingText);

      if (nextMatch) {
        const { match, type } = nextMatch;
        const start = match.index;
        const end = start + match[0].length;
        const matchedText = match[1];

        addTextNode(remainingText.slice(0, start));

        const nestedMatch = findNextMatch(matchedText);
        if (nestedMatch) {
          const nestedContent = parseTextStyle(matchedText);
          nestedContent.forEach((node) => {
            if (!node.marks) node.marks = [];
            node.marks.push({ type });
            nodes.push(node);
          });
        } else {
          addTextNode(matchedText, [{ type }]);
        }

        currentIndex += end;
      } else {
        addTextNode(remainingText);
        break;
      }
    }

    return nodes;
  }

  function adjustListStack(indentLevel) {
    if (indentLevel > currentIndentLevel) {
      startList();
    } else if (indentLevel < currentIndentLevel) {
      endList();
    }
    currentIndentLevel = indentLevel;
  }

  function addHeading(text, level) {
    const parsedText = parseTextStyle(text);
    result.push({
      type: "heading",
      attrs: { level },
      content: parsedText,
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
    const parsedText = parseTextStyle(text);
    const listItem = {
      type: "listItem",
      content: [{ type: "paragraph", content: parsedText }],
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

  function addParagraph(text) {
    const parsedText = parseTextStyle(text);
    result.push({
      type: "paragraph",
      content: parsedText,
    });
  }

  function addDiagram(url, title) {
    result.push({
      type: "image",
      attrs: { src: url, title, alt: title },
    });
  }

  return { type: "doc", content: result };
};

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
