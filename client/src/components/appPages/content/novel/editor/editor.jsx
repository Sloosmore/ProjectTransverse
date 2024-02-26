"use client";

import {
  EditorContent,
  EditorRoot,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorBubble,
  defaultEditorProps,
} from "novel";
import React, { useEffect, useState } from "react";

import { defaultExtensions } from "./extentions/extensions";
import { slashCommand } from "./extentions/slash-command";
import { Separator } from "@/components/ui/separator";

import { suggestionItems } from "./extentions/slash-command";
import { NodeSelector } from "./bubble/nodeSelector";
import { TextButtons } from "./bubble/text-buttons";
import "./editor.css";
import { useDebouncedCallback } from "use-debounce";
import { ImageResizer } from "novel/extensions";
import { saveNoteMarkdown } from "@/components/appPages/services/crudApi";
import { updateTitle } from "@/components/appPages/services/crudApi";

const extensions = [...defaultExtensions, slashCommand];

const NovelEditor = ({ currentNote, contentKit }) => {
  const { title, json_content, full_markdown, note_id } = currentNote;
  const {
    content,
    setContent,
    editKey,
    setEditKey,
    updatedTitle,
    setUpdatedTitle,
  } = contentKit;
  const [openNode, setOpenNode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    setContent(json);
    console.log(json);
    setSaveStatus("Saved");
    saveNoteMarkdown(note_id, full_markdown, json);
  }, 300);

  const debounceTitle = useDebouncedCallback(async (updatedTitle) => {
    updateTitle(note_id, updatedTitle);
  }, 1500);

  useEffect(() => {
    debounceTitle(updatedTitle);
  }, [updatedTitle]);

  return (
    <EditorRoot>
      <EditorContent
        className=" top-div h-full relative relative min-h-[500px] w-full max-w-screen-lg "
        extensions={extensions}
        initialContent={content}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
          setSaveStatus("Unsaved");
        }}
        editorProps={{
          ...defaultEditorProps,
          attributes: {
            class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full w-full mx-auto  h-full`,
          },
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <Separator orientation="vertical" />

          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
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
                <div className="font-medium mt-1.5">{item.title}</div>
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
