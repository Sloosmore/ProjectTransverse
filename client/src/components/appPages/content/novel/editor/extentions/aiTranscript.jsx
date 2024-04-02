import { TextSelection } from "prosemirror-state";
/*
const AiTranscript = Ai.extend({
  addOptions: {
    currentNote: null,
    transcript: "",
  },

  addCommands() {
    return {
      ...this.parent?.(),

      rewind:
        () =>
        ({ editor }) => {
          const { full_transcript: NoteTs } = this.options.currentNote;

          const newTranscript = this.options.transcript;

          const newTsLen = newTranscript?.length || 0;
          const noteTsLen = NoteTs?.length || 0;

          let promptTs;

          if (newTsLen > 1000) {
            promptTs = newTranscript.slice(newTsLen - 1000, newTsLen);
          } else if (noteTsLen + newTsLen < 1000) {
            return;
          } else {
            const slice = 1000 - newTsLen;

            const newTs = NoteTs.slice(noteTsLen - slice, noteTsLen);

            promptTs = newTs + newTranscript;
          }

          return editor.commands.aiTextPrompt({
            stream: true,
            modelName: "gpt-3.5-turbo-0125",
            text: `Summerize the folling transcript as if a student was taking notes on it and be consice: ${promptTs}`,
          });
        },

      insertNewNode:
        () =>
        ({ tr, dispatch }) => {
          // Get the current selection and node
          const { selection, doc } = tr;
          const { from } = selection;
          const posBefore = tr.doc.resolve(from);

          // Determine the position to insert the new node (after current node)
          let insertPos = posBefore.after();
          if (insertPos > doc.content.size) {
            insertPos = doc.content.size;
          }

          // Create a new node (e.g., paragraph)
          const nodeType = this.editor.schema.nodes.paragraph;
          const newNode = nodeType.create();

          // Insert the new node and set the selection
          if (dispatch) {
            tr.insert(insertPos, newNode);
            tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));
          }

          return true;
        },

      updateAIProps:
        (currentNote, transcript) =>
        ({ tr, state, dispatch }) => {
          this.options.currentNote = currentNote;
          this.options.transcript = transcript;
          return true;
        },
    };
  },
});

*/
