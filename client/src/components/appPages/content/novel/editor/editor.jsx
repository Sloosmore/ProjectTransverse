"use client";

import {
  EditorContent,
  EditorRoot,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorBubble,
  EditorCommandList,
} from "novel";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { defaultExtensions } from "./extentions/extensions";
import { slashCommand } from "./extentions/slash-command";
import { Separator } from "@/components/ui/separator";
import { suggestionItems } from "./extentions/slash-command";
import { NodeSelector } from "./bubble/nodeSelector";
import { TextButtons } from "./bubble/text-buttons";
import "./editor.css";
import { useDebouncedCallback } from "use-debounce";
import { saveNoteMarkdown } from "@/components/appPages/services/crudApi";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./extentions/image-upload";
import UniversalTimeAttribute from "./extentions/time";
import AppendJSONExtension from "./extentions/addJSON";
import AppendJSONComponent from "./insideComponents/addJsonComp";
import EditTitle from "./title";
import { SkeletonCard, SkeletonLoad } from "./insideComponents/skeleton";
import Playback from "./bubble/playback-buttons";
import SpeakExtension from "./extentions/speak";
import UpdateNoteState from "./insideComponents/updateExtentionState";
import ErrorBoundary from "./errorBoundary";
import AiTranscript from "./extentions/aiTranscript";
import { TranscriptContext } from "@/hooks/transcriptStore";
import { useAuth } from "@/hooks/auth";
import { useContext } from "react";
import RunAI from "./insideComponents/runAi";

const NovelEditor = ({
  currentNote,
  contentKit,
  ToggleGenKit,
  setglobalSeek,
}) => {
  const { tiptapToken } = useAuth();
  const transcript = useContext(TranscriptContext);
  const extensions = [
    UniversalTimeAttribute.configure({
      currentNote: currentNote,
    }),
    AppendJSONExtension,
    SpeakExtension,
    ...defaultExtensions,
    slashCommand,
    AiTranscript.configure({
      currentNote: currentNote,
      transcript: transcript,
      appId: import.meta.env.VITE_TIPTAP_ID,
      token: tiptapToken,
    }),
  ];
  //mode
  const { title, json_content, full_markdown, note_id, new_json } = currentNote;

  const { content, setContent } = contentKit;

  const [openNode, setOpenNode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    console.log("setting json");
    setContent(json);
    console.log(json);
    setSaveStatus("Saved");
    saveNoteMarkdown(note_id, full_markdown, json);
  }, 300);

  const { mode, diagramOn, noteOn } = ToggleGenKit;

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (content) {
      setUpdate(true);
      console.log("update");
    }
  }, [content]);

  useEffect(() => {
    setJsonToAppend(new_json);
  }, [new_json]);

  const [jsonToAppend, setJsonToAppend] = useState();

  return (
    <div key={update} className="w-full flex flex-col justify-center">
      <EditTitle currentNote={currentNote} />

      <ErrorBoundary>
        <EditorRoot>
          <EditorContent
            className="h-full relative relative w-full justify-center"
            extensions={extensions}
            initialContent={content}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("Unsaved");
            }}
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) =>
                handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) =>
                handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none w-full mx-auto h-full `,
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
              <TextButtons />
              {mode === "default" && <Playback setglobalSeek={setglobalSeek} />}
            </EditorBubble>

            <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
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
              </EditorCommandList>
            </EditorCommand>
            <AppendJSONComponent jsonToAppend={jsonToAppend} mode={mode} />
            <RunAI />
            <UpdateNoteState
              currentNote={currentNote}
              transcript={transcript}
            />
          </EditorContent>
        </EditorRoot>
      </ErrorBoundary>

      {mode === "note" && diagramOn && (
        <div className="md:px-12 px-6 w-full mb-6">
          <SkeletonCard />
        </div>
      )}
      {mode === "note" && noteOn && (
        <div className="md:px-12 px-6 w-full mb-6">
          <SkeletonLoad />
        </div>
      )}
    </div>
  );
};
export default NovelEditor;
