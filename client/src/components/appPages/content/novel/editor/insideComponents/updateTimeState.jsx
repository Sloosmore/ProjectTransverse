import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect } from "react";

const UpdateNoteState = ({ currentNote }) => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && currentNote) {
      // Assuming `appendJSON` is a command you've added to your TipTap editor
      setTimeout(() => {
        console.log("updating props");
        editor.commands.updateProps(currentNote);
      }, 200);
    }
  }, [currentNote]);

  return null; // This component doesn't render anything
};

export default UpdateNoteState;

//&& mode === "note"
