import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import { useRewind } from "@/hooks/aiRewind";

const RunAI = () => {
  const { editor } = useCurrentEditor();
  const { rewind } = useRewind();

  useEffect(() => {
    console.log("rewind:", rewind);
    if (editor && rewind) {
      editor.chain().focus().run();

      console.log("rewind ran");
    }
  }, [rewind]);

  return null; // This component doesn't render anything
};

export default RunAI;
