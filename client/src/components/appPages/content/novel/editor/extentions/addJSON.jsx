import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
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
          let decorations = [];

          content.forEach((nodeData) => {
            const node = editor.schema.nodeFromJSON(nodeData);
            tr.insert(position, node);
            decorations.push(
              Decoration.node(position, position + node.nodeSize, {
                class: "fade-in",
              })
            );
            position += node.nodeSize;
          });

          const fadeInPlugin = new Plugin({
            props: {
              decorations() {
                return DecorationSet.create(tr.doc, decorations);
              },
            },
          });

          editor.view.setProps({
            plugins: (editor.view.props.plugins || []).concat(fadeInPlugin),
          });

          // Return the modified transaction
          return true;
        },
    };
  },
});

export default AppendJSONExtension;
