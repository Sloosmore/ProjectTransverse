import { Extension } from "@tiptap/core";
import { TextSelection, NodeSelection } from "prosemirror-state";
import { splitBlock, setBlockType, lift } from "prosemirror-commands";
import { findParentNode } from "prosemirror-utils";

const aiTranscript = Extension.create({
  addCommands() {
    return {
      insertCustomCharacter:
        (character) =>
        ({ state, dispatch }) => {
          const { selection, schema } = state;
          const { empty, $from } = selection;
          const currentNode = $from.node();

          if (empty && currentNode.content.size === 0) {
            let nodeType = null;
            let attrs = {};
            let command = null;

            if (
              ["#", "##", "###", "####", "#####", "######"].includes(character)
            ) {
              // Handle headings
              nodeType = schema.nodes.heading;
              attrs = { level: character.length };
              return setBlockType(nodeType, attrs)(state, dispatch);
            } else if (["-", "*", "+"].includes(character)) {
              const listItem = state.schema.nodes.listItem.createAndFill();
              const bulletList = state.schema.nodes.bulletList.createAndFill(
                null,
                listItem
              );

              dispatch(
                state.tr.replaceSelectionWith(bulletList).scrollIntoView()
              );
              return true;
            }
          }

          if (character === "\n") {
            // If the character is a newline, split the block to create a new paragraph
            // Check if inside a bullet list by traversing up the node hierarchy
            let insideBulletList = false;
            let listDepth = 0;
            for (let i = $from.depth; i > 0; i--) {
              if ($from.node(i).type.name === "bulletList") {
                insideBulletList = true;
                listDepth = i;
                break;
              }
            }

            if (insideBulletList) {
              // If inside a bullet list, find the position right after the list
              let pos = $from.after(listDepth);
              if (pos <= state.doc.content.size) {
                dispatch(
                  state.tr
                    .insert(pos, state.schema.nodes.paragraph.create())
                    .scrollIntoView()
                );
                dispatch(
                  state.tr.setSelection(
                    TextSelection.create(state.tr.doc, pos + 1)
                  )
                );
                return true;
              }
            } else {
              // If not in a bullet list, just split the block
              return splitBlock(state, dispatch);
            }
          } else {
            // For other characters, insert them as usual
            if (dispatch) {
              const isNodeEmpty = $from.parent.content.size === 0;

              // If the character is a space and the node is empty, do not insert it
              if (character === " " && isNodeEmpty) {
                return true;
              }
              dispatch(state.tr.insertText(character));

              // Find the end position of the current node
              const endOfNodePos = state.tr.selection.$to.end();

              // Set the cursor position at the end of the current node
              dispatch(
                state.tr.setSelection(
                  TextSelection.create(state.tr.doc, endOfNodePos)
                )
              );
            }
          }
          return true; // Indicates that this command is successfully executed
        },

      insertNewNode:
        () =>
        ({ tr, dispatch }) => {
          // Get the current selection and node
          const { doc } = tr;

          // Get the last node

          const lastNode = doc.nodeAt(doc.content.size - 1);

          if (!lastNode) {
            return false;
          }

          // Check if the last node is an image
          const isImage = lastNode.type.name === "image";

          // Check if the last node is empty
          const isEmpty = lastNode.content.size === 0;

          // If the last node is not an image and is empty, set the selection there
          if (!isImage && isEmpty) {
            if (dispatch) {
              tr.setSelection(
                TextSelection.create(tr.doc, doc.content.size - 1)
              );
            }
          } else {
            // Determine the position to insert the new node (at the end of the document)
            const insertPos = doc.content.size;

            // Create a new node (e.g., paragraph)
            const nodeType = this.editor.schema.nodes.paragraph;
            const newNode = nodeType.create();

            // Insert the new node
            if (dispatch) {
              tr.insert(insertPos, newNode);

              // Set the selection to the start of the new node
              tr.setSelection(TextSelection.create(tr.doc, doc.content.size));
            }
          }
          return true;
        },
    };
  },
});

export default aiTranscript;
