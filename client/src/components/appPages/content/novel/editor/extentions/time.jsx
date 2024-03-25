import { Extension } from "@tiptap/core";

const highLevelNodes = [
  "paragraph", // Standard text block
  "heading", // Headings (usually includes levels like h1, h2, etc.)
  "listItem", // Items in ordered and unordered lists
  "bulletList", // Unordered list
  "orderedList", // Ordered list
  "blockquote", // Blockquote for quotes or citations
  "codeBlock", // Block for code snippets
  "horizontalRule", // Horizontal rule for thematic breaks
  "hardBreak", // Line break that always starts a new line
  "image", // Images (if you treat them as block-level)
  "table", // Tables (and possibly its components like tableRow, tableHeader, etc., if applicable)
  "todoItem", // Items in a to-do list (if you have a to-do list feature)
  "panel", // Panels or custom styled sections
  "divider", // Dividers or separators
  "iframe", // Embed iframes (for embedding videos, maps, etc.)
  "mathBlock", // Blocks for mathematical formulas (if using a math extension)
];

const UniversalTimeAttribute = Extension.create({
  name: "universalTimeAttribute",

  // This will add the time attribute to all top-level nodes
  addGlobalAttributes() {
    return [
      {
        types: highLevelNodes,
        attributes: {
          time: {
            default: null,
            renderHTML: (attributes) => {
              return {
                "data-time": attributes.time,
              };
            },
            parseHTML: (element) => {
              return {
                time: element.getAttribute("data-time"),
              };
            },
          },
        },
      },
    ];
  },
});

export default UniversalTimeAttribute;
