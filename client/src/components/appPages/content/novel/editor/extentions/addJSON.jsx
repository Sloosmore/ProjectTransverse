import { Extension } from "@tiptap/core";

const AppendJSONExtension = Extension.create({
  name: "appendJSON",

  addCommands() {
    return {
      appendJSON:
        (options) =>
        ({ tr, editor }) => {
          console.log("appending json");
          // `options` should contain the JSON you want to append
          const { content } = options; // `content` should be an array of nodes

          if (!Array.isArray(content)) {
            console.error("Invalid content: Expected an array of nodes.");
            return false;
          }

          // Find the end position of the current document
          let position = tr.doc.content.size;

          content.forEach((nodeData) => {
            const node = editor.schema.nodeFromJSON(nodeData);
            tr.insert(position, node);
            position += node.nodeSize; // Update the position for the next node
          });

          // Return the modified transaction
          return true;
        },
    };
  },
});

export default AppendJSONExtension;
