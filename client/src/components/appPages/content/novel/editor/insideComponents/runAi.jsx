import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import { useRewind } from "@/hooks/aiRewind";
import { TranscriptContext } from "@/hooks/transcriptStore";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

import { rewindContext } from "@/components/appPages/services/rewind";
const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

const RunAI = () => {
  const { editor } = useCurrentEditor();
  const { rewind, setRewind } = useRewind();
  const { fullTranscript, caption } = useContext(TranscriptContext);
  const { noteId } = useParams();
  const { session } = useAuth();

  const parseMarkdown = (markdownText) => {
    // Array to hold the results
    const elements = [];

    // Regular expression to match individual alphabetic characters, spaces, bullets, and headers
    const regex = /([a-zA-Z])|(\s)|^( *)([-*+]|\#{1,6})/gm;

    // Split the markdown text into lines
    const lines = markdownText.split("\n");

    // Iterate over each line
    lines.forEach((line, index) => {
      let match;
      // Use the regex to find matches in the line
      while ((match = regex.exec(line)) !== null) {
        // Add the matched element (character, space, bullet, or header) to the array
        elements.push(match[0]);
      }

      // Add a line break symbol after each line, except the last one
      if (index < lines.length - 1) {
        elements.push("\n");
      }
    });

    return elements;
  };

  const insert = async (text) => {
    const elements = parseMarkdown(text);
    console.log(elements);

    for (let i = 0; i < elements.length; i++) {
      editor.chain().insertCustomCharacter(elements[i]).run();

      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for 1 second
    }
  };

  //this is a test\n He\n He has\n His mother.
  //

  useEffect(() => {
    if (inDevelopment) console.log("rewind:", rewind);

    if (editor && rewind) {
      const runRewind = async () => {
        const { contentLevel } = await rewindContext(
          session,
          noteId,
          fullTranscript,
          caption
        );

        editor.chain().focus().appendJSON({ content: contentLevel }).run();

        //response = response.replace(/^[ \t]*/gm, "").replace(/\n+/g, "\n");
        /*
        const response = "- test\n### test2\n- He\n- He has\n- His mother.";
        await editor.chain().insertNewNode().focus().run();
        setTimeout(() => {
          insert(response);
        }, [200]);
        console.log("rewind ran");
        */

        setRewind(false);
      };

      runRewind();
    }
  }, [rewind]);

  return null; // This component doesn't render anything
};

export default RunAI;
