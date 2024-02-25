import NovelEditor from "./editor/editor";
import {
  Captions,
  NotebookPen,
  SplitSquareHorizontal,
  ListVideo,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Transcript from "./transcript";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
const tooltips = [
  { icon: "bi bi-pencil-square", content: "Edit" },
  { icon: "bi bi-card-text", content: "Transcript" },
  { icon: "bi bi-window-split", content: "Split" },
];
import Playback from "./playback/playback";
import { useParams } from "react-router-dom";
import RecPause from "./recPause/recPause";
import { useWindowWidth } from "@/hooks/windowWidth";
import { Separator } from "@/components/ui/separator";

function NoteComponent({
  noteData,
  modeKit,
  annotatingKit,
  transcript,
  pauseProps,
}) {
  const { noteId } = useParams();
  //consitional rendering
  const [editorState, setEditorState] = useState("Edit");
  //need to be here because of conditional rendering
  const [content, setContent] = useState();
  const [editKey, setEditKey] = useState(0);
  const [updatedTitle, setUpdatedTitle] = useState();

  //more conditional rendering
  const windowWidth = useWindowWidth();
  //keep track of the current note
  const [currentNote, setCurrentNote] = useState({});

  useEffect(() => {
    const note = noteData.find((record) => noteId === record.note_id);
    if (note) {
      setCurrentNote(note);
    }
  }, [noteData, noteId]);

  useEffect(() => {
    setUpdatedTitle(currentNote.tile);
    setContent(currentNote.json_content);
    setEditKey((prevKey) => prevKey + 1);
  }, [currentNote]);

  const contentKit = {
    content,
    setContent,
    editKey,
    setEditKey,
    updatedTitle,
    setUpdatedTitle,
  };

  return (
    <div className="flex-grow flex flex-col px-10 overflow-auto">
      <div className="h-12 flex-none border-bottom flex">
        <div className="my-auto md:ps-10 flex w-full justify-between">
          <div className="flex h-5 items-center text-sm text-gray-400 my-auto ">
            <div className="flex">
              {tooltips.map(
                (tooltip, index) =>
                  (windowWidth > 640 || tooltip.content !== "Split") && (
                    <div
                      className={`  ${
                        tooltip.content === editorState ? "text-gray-600" : ""
                      }`}
                      key={index}
                      onClick={() => {
                        setEditorState(tooltip.content);
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
          <div className="text-gray-400 flex align-items">
            <RecPause pauseProps={pauseProps} localNoteID={noteId} />
            <Separator orientation="vertical" className="me-2.5" />
            <Playback />
          </div>
        </div>
      </div>
      {editorState === "Edit" && (
        <div className="overflow-auto lg:px-20 md:px-10 flex-grow">
          <NovelEditor currentNote={currentNote} contentKit={contentKit} />
        </div>
      )}
      {editorState === "Transcript" && (
        <div className="overflow-auto flex-grow min-h-0">
          <Transcript currentNote={currentNote} transcript={transcript} />
        </div>
      )}
      {editorState === "Split" && (
        <div className="overflow-auto flex-grow min-h-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow">
                <NovelEditor
                  currentNote={currentNote}
                  contentKit={contentKit}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex flex-col">
              <div className="overflow-auto flex-grow min-h-0">
                <Transcript currentNote={currentNote} transcript={transcript} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}

export default NoteComponent;
