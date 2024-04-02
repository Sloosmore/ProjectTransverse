import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect } from "react";

const UpdateNoteState = ({ currentNote, transcript }) => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && currentNote) {
      // Assuming `appendJSON` is a command you've added to your TipTap editor
      setTimeout(() => {
        editor.commands.updateProps(currentNote);
        editor.commands.updateAIProps(currentNote, transcript);
      }, 200);
    }
  }, [currentNote]);

  useEffect(() => {
    console.log("transcript:", transcript);
    if (editor && transcript) {
      setTimeout(() => {
        editor.commands.updateAIProps(currentNote, transcript);
      }, 200);
    }
  }, [transcript]);

  return null; // This component doesn't render anything
};

export default UpdateNoteState;

//&& mode === "note"
