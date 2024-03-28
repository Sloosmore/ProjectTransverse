import { Extension } from "@tiptap/core";

const CustomEnterBehavior = Extension.create({
  name: "customEnterBehavior",

  addKeyboardShortcuts() {
    return {
      Enter: () =>
        this.editor.commands.command(({ tr, state }) => {
          const { selection } = state;
          const { $from } = selection;

          // Let the default Enter behavior execute first
          const defaultHandled = this.editor.commands.splitBlock();
          if (!defaultHandled) return false;

          // Calculate the position after the split
          const posAfterSplit = $from.pos + 1;

          // Ensure there's a node at the new position
          if (
            tr.doc.nodeAt(posAfterSplit) &&
            !tr.doc.nodeAt(posAfterSplit).isText
          ) {
            // Modify the attributes of the new node
            tr.setNodeMarkup(posAfterSplit, null, {
              ...$from.node().attrs,
              time: null,
            });
            this.editor.view.dispatch(tr);
            return true;
          }

          return false;
        }),
    };
  },
});

export default CustomEnterBehavior;
