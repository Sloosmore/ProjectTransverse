import NovelEditor from "./editor";
import { Captions, NotebookPen, SplitSquareHorizontal } from "lucide-react";
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
import { initialContent } from "./initContent";

function NoteComponent() {
  function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
  }
  const [editorState, setEditorState] = useState("Edit");
  const [content, setContent] = useState(initialContent);
  const windowWidth = useWindowWidth();

  const contentKit = {
    content,
    setContent,
  };

  return (
    <div className="h-full  px-10">
      <div className="h-12 border-bottom flex">
        <div className="my-auto md:ps-10">
          <div className="flex h-5 items-center text-sm text-gray-400 ">
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
                            className={`${tooltip.icon} p-2.5 hover:bg-gray-100 rounded cursor-pointer`}
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
      {editorState === "Edit" && (
        <div
          className="overflow-auto lg:px-20 md:px-10"
          style={{ height: `calc(100% - 7rem)` }}
        >
          <NovelEditor contentKit={contentKit} />
        </div>
      )}
      {editorState === "Transcript" && (
        <div className="h-full">
          <Transcript />
        </div>
      )}
      {editorState === "Split" && (
        <div className="overflow-auto " style={{ height: `calc(100% - 7rem)` }}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <NovelEditor contentKit={contentKit} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <Transcript />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}

export default NoteComponent;
