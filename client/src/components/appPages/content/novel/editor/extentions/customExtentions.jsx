import { Extension } from "@tiptap/core";

//There are two extentions

//1. Adding extra context into the editor json content so that we can use it for playback

//2. Adding a read-aloud feature to the editor for the writen notes

const readAloud = Extension.create({
  commands: {
    readAloud: ({ editor }) => {
      const { json_content } = currentNote;
      const text = json_content.map((block) => block.content).join(" ");
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    },
  },
});
