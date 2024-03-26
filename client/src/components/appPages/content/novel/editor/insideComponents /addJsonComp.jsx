import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect } from "react";

const AppendJSONComponent = ({ jsonToAppend, mode }) => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && jsonToAppend) {
      // Assuming `appendJSON` is a command you've added to your TipTap editor
      setTimeout(() => {
        editor.chain().focus().appendJSON({ content: jsonToAppend }).run();
      }, 200);
    }
  }, [jsonToAppend]);

  return null; // This component doesn't render anything
};

export default AppendJSONComponent;

//&& mode === "note"
