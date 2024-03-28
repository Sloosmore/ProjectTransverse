import { Extension } from "@tiptap/core";

const SpeakExtension = Extension.create({
  name: "speak",

  addCommands() {
    return {
      speak:
        () =>
        ({ editor }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to, " ");

          if (window.speechSynthesis && text) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
          }

          return true;
        },
    };
  },
});

export default SpeakExtension;
