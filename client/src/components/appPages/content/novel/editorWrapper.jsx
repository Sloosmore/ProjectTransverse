import NovelEditor from "./editor/editor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Transcript from "./transcript";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

//  { icon: "bi bi-window-split", content: "Split" },

import Playback from "./playback/playback";
import { useParams } from "react-router-dom";
import RecPause from "./recPause/recPause";
import { useWindowWidth } from "@/hooks/windowWidth";
import { Separator } from "@/components/ui/separator";
import Slides from "./slides";
import AudioControls from "./playback/streamAudio";
import { useNoteData } from "@/hooks/noteDataStore";
import { useRewind } from "@/hooks/aiRewind";

function NoteComponent() {
  const { mode, noteData } = useNoteData();

  const { noteId } = useParams();
  const [content, setContent] = useState();
  const [editKey, setEditKey] = useState(0);
  const [updatedTitle, setUpdatedTitle] = useState();
  const [editView, setEditView] = useState(true);
  const [transcriptView, setTranscriptView] = useState(false);
  const [slideView, setSlideView] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");
  const [audioView, setAudioView] = useState(true);
  const [globalSeek, setglobalSeek] = useState(0.0);
  const [diagramOn, setDiagramOn] = useState(false);
  const [noteOn, setNoteOn] = useState(false);

  const ToggleGenKit = {
    diagramOn,
    setDiagramOn,
    noteOn,
    setNoteOn,
    mode,
  };

  useEffect(() => {
    setDiagramOn(currentNote.diagram_gen_on);
    setNoteOn(currentNote.note_gen_on);
  }, [noteId]);

  const tooltips = [
    {
      icon: "bi bi-pencil-square",
      content: "Edit",
      function: setEditView,
      variable: editView,
    },
    {
      icon: "bi bi-chat-text",
      content: "Transcript",
      function: setTranscriptView,
      variable: transcriptView,
    },
    {
      icon: "bi bi-easel2",
      content: "Slides",
      function: setSlideView,
      variable: slideView,
    },
  ];

  //more conditional rendering
  const windowWidth = useWindowWidth();
  //keep track of the current note
  const [currentNote, setCurrentNote] = useState({});

  useEffect(() => {
    console.log("noteId", noteId);
    if (noteData) {
      const note = noteData.find((record) => noteId === record.note_id);
      if (note) {
        console.log("note", note);
        setCurrentNote(note);
        if (note.slide_url) {
          setActiveUrl(note.slide_url);
        }
      }
    }
  }, [noteData, noteId]);

  useEffect(() => {
    setUpdatedTitle(currentNote.title);
    if (currentNote.json_content !== content) {
      setContent(currentNote.json_content);
      console.log("content", currentNote.json_content);
    }
    console.log("currentNote", currentNote);
    //setKeyFlag(keyFlag + 1);
  }, [currentNote.json_content, currentNote.title]);

  useEffect(() => {
    setActiveUrl(currentNote.slide_url);
  }, [currentNote.slide_url]);

  const contentKit = {
    content,
    setContent,
    editKey,
    setEditKey,
    updatedTitle,
    setUpdatedTitle,
  };

  return (
    <div className="flex-grow flex flex-col px-10 overflow-auto text-gray-500">
      <div className="h-12 flex-none border-b flex">
        <div className="my-auto md:ps-10 flex w-full justify-between">
          <div className="text-gray-400 flex align-items">
            <RecPause localNoteID={noteId} ToggleGenKit={ToggleGenKit} />
            {mode === "default" && (
              <>
                <Separator orientation="vertical" className="me-2.5" />
                <button onClick={() => setAudioView((view) => !view)}>
                  <i
                    className={`bi bi-collection-play p-2.5 hover:bg-gray-100 rounded cursor-pointer ${
                      mode === "default" && audioView && "text-gray-500"
                    }`}
                    style={{ fontSize: "1.1rem" }}
                  ></i>
                </button>
              </>
            )}
          </div>
          <div className="flex h-5 items-center text-sm text-gray-400 my-auto me-2 md:me-16">
            <div className="flex">
              {tooltips.map(
                (tooltip, index) =>
                  (windowWidth > 640 || tooltip.content !== "Split") && (
                    <div
                      className={`  ${
                        tooltip.variable === true ? "text-gray-600" : ""
                      }`}
                      key={index}
                      onClick={() => {
                        tooltip.function((prev) => !prev);
                      }}
                      tabIndex={index}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <i
                              className={`${tooltip.icon} p-2.5 hover:bg-gray-100 rounded cursor-pointer `}
                              style={{ fontSize: "1.1rem" }}
                            ></i>
                          </TooltipTrigger>

                          <TooltipContent>
                            <div>{tooltip.content}</div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-0">
        {transcriptView && !(editView || slideView) && (
          <div className="overflow-auto flex-grow min-h-0">
            <Transcript currentNote={currentNote} />
          </div>
        )}
        {slideView && !(editView || transcriptView) && (
          <div className="overflow-auto flex-grow min-h-0 items-center h-full">
            <Slides
              currentNote={currentNote}
              activeUrl={activeUrl}
              setActiveUrl={setActiveUrl}
            />
          </div>
        )}
        {editView && !(slideView || transcriptView) && (
          <ResizablePanelGroup>
            <ResizablePanel className="flex flex-col xl:mx-40">
              <div className="overflow-auto flex-grow">
                <div className="flex-grow">
                  <NovelEditor
                    currentNote={currentNote}
                    contentKit={contentKit}
                    ToggleGenKit={ToggleGenKit}
                    setglobalSeek={setglobalSeek}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        {editView && slideView && !transcriptView && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow">
                <div className="flex-grow">
                  <NovelEditor
                    currentNote={currentNote}
                    contentKit={contentKit}
                    ToggleGenKit={ToggleGenKit}
                    setglobalSeek={setglobalSeek}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow min-h-0">
                <Slides
                  currentNote={currentNote}
                  activeUrl={activeUrl}
                  setActiveUrl={setActiveUrl}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        {editView && !slideView && transcriptView && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow">
                <div className="flex-grow">
                  <NovelEditor
                    currentNote={currentNote}
                    contentKit={contentKit}
                    ToggleGenKit={ToggleGenKit}
                    setglobalSeek={setglobalSeek}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow min-h-0">
                <Transcript currentNote={currentNote} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        {!editView && slideView && transcriptView && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex flex-col">
              {" "}
              <div className="overflow-auto flex-grow min-h-0">
                <Slides
                  currentNote={currentNote}
                  activeUrl={activeUrl}
                  setActiveUrl={setActiveUrl}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow min-h-0">
                <Transcript currentNote={currentNote} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        {editView && slideView && transcriptView && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow">
                <div className="flex-grow">
                  <NovelEditor
                    currentNote={currentNote}
                    contentKit={contentKit}
                    ToggleGenKit={ToggleGenKit}
                    setglobalSeek={setglobalSeek}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex flex-col">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel className="flex flex-col">
                  <div className="overflow-auto flex-grow min-h-0">
                    <Slides
                      currentNote={currentNote}
                      activeUrl={activeUrl}
                      setActiveUrl={setActiveUrl}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="flex flex-col">
                  <div className="overflow-auto flex-grow min-h-0">
                    <Transcript currentNote={currentNote} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        {!(editView || slideView || transcriptView) && (
          <div className="flex justify-center items-center h-full">
            <h1 className="my-auto text-center p-20">
              if you hate this notetaker text me feedback (206) 372-0327 <br />
            </h1>
          </div>
        )}
      </div>

      {mode === "default" && audioView && (
        <div className="h-24 flex-none border-t flex">
          <AudioControls
            currentNote={currentNote}
            globalSeek={globalSeek}
            setglobalSeek={setglobalSeek}
          />
        </div>
      )}
    </div>
  );
}

export default NoteComponent;
