import { cn } from "@/lib/utils";
import { Extension } from "@tiptap/core";
import { calcTime } from "./calcNewTime";

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

  addOptions: {
    currentNote: null,
  },

  // This will add the time attribute to all top-level nodes
  addCommands() {
    return {
      getTime:
        () =>
        ({ editor }) => {
          const { from } = editor.state.selection;
          const $pos = editor.view.state.doc.resolve(from);
          const parentNodePos = $pos.before($pos.depth);
          const parentNode = editor.view.state.doc.nodeAt(parentNodePos);

          console.log(`parentNode`, parentNode);

          if (parentNode && parentNode.attrs.time) {
            console.log(`parentNode.attrs.time`, parentNode.attrs.time);
            return parentNode.attrs.time;
          }

          return 1000;
        },
      updateTime:
        () =>
        ({ editor }) => {
          const { doc } = editor.state;
          const transaction = editor.state.tr;
          let updated = false;

          const { pause_timestamps, play_timestamps } =
            this.options.currentNote;
          console.log(
            `pause_array play_array`,
            pause_timestamps,
            play_timestamps
          );
          const newTime = calcTime(play_timestamps, pause_timestamps);
          console.log(`newTime`, newTime);

          editor.state.doc.descendants((node, pos) => {
            // Check if the node has a 'time' attribute

            if (node.isText) {
              return;
            }

            const shouldUpdateTime =
              "time" in node.attrs
                ? node.attrs.time === 0 || node.textContent.length < 3
                : true;

            if (shouldUpdateTime) {
              console.log("updating time for node", node, "new time:", newTime);
              transaction.setNodeMarkup(pos, null, {
                ...node.attrs,
                time: newTime,
              });
              updated = true;
            }
          });

          if (updated) {
            editor.view.dispatch(transaction);
          }
        },
      updateProps:
        (newPropValue) =>
        ({ tr, state, dispatch }) => {
          this.options.currentNote = newPropValue;
          // Optionally, you could trigger a transaction to update the editor's state
          // tr.setMeta('myPropUpdated', true);
          // if (dispatch) dispatch(tr);
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    /*
    const keys = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
    const shortcuts = {};

    keys.forEach((key) => {
      shortcuts[key] = ({ editor }) => {
        console.log(`${key} key pressed`);
        if (editor.commands.updateTime) {
          editor.commands.updateTime();
        } else {
          console.error("updateTime command is not defined");
        }
        return true;
      };
    });

    return shortcuts;
    */
    return {
      Enter: ({ editor }) => {
        setTimeout(() => {
          console.log("Enter key pressed");
          editor.commands.updateTime();
          return true;
        }, 100);
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: highLevelNodes,
        attributes: {
          time: {
            default: 0,
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
