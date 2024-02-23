"use client";

import {
  EditorContent,
  EditorRoot,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorBubble,
} from "novel";
import { useState } from "react";
import { defaultExtensions, slashCommand } from "./slash/extensions";
import { defaultEditorProps } from "./commands";
import { suggestionItems } from "./slash/slash-command";
import { NodeSelector } from "./bubble/nodeSelector";
import { TextButtons } from "./bubble/text-buttons";
import "./editor.css";
import { useDebouncedCallback } from "use-debounce";

const extensions = [...defaultExtensions, slashCommand];

const NovelEditor = ({ contentKit }) => {
  const { content, setContent } = contentKit;
  const [openNode, setOpenNode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    setContent(json);
    console.log(json);
    setSaveStatus("Saved");
  }, 300);

  return (
    <EditorRoot>
      <EditorContent
        className=" top-div flex h-full"
        extensions={extensions}
        initialContent={content}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
          setSaveStatus("Unsaved");
        }}
        editorProps={{
          ...defaultEditorProps,
          attributes: {
            class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full w-full mx-auto  lg:px-12 px-8 py-8 h-full`,
          },
        }}
      >
        <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl">
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <TextButtons />
        </EditorBubble>
        <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          {suggestionItems.map((item) => (
            <EditorCommandItem
              value={item.title}
              onCommand={(val) => item.command(val)}
              className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
              key={item.title}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </EditorCommandItem>
          ))}
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
};
export default NovelEditor;
/*

*/
