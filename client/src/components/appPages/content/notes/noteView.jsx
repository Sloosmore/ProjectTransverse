import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadNote from "./noteload";
import { splitMarkdown } from "../../services/frontendNoteConfig/parseMarkdown";
import TextToSpeech from "../../funcComponents/textToSpeach";
import "./noteView.css";
import { saveNoteMarkdown } from "../../services/crudApi";
import SideNotes from "./sideNotes";
import MarkdownElement from "./md";

function Noteroom({
  noteData,
  modeKit,
  annotatingKit,
  transcript,
  pauseProps,
}) {
  const { noteId } = useParams();
  const location = useLocation();
  const { annotating, setAnnotating } = annotatingKit;

  //needs to be edited
  //only will naviate to this page automatically if note is active so it is a nice little trick
  const [status, setStatus] = useState(location.state?.status || "active");
  const [noteID, setNoteID] = useState(location.state?.note_id || noteId);
  const [selectedText, setSelectedText] = useState("");
  const [markdown, setMarkdown] = useState(
    location.state?.full_markdown || location.state?.markdown
  );
  const [title, setTitle] = useState(location.state?.title);

  const [fullTs, setFullTs] = useState(location.state?.full_transcript);
  //this is the incomming markdown
  //const [activeMarkdown, setActiveMarkdown] = useState("");

  const [view, setView] = useState("notes");

  useEffect(() => {
    //grabs from notedata
    const note = noteData.filter((record) => noteId === record.note_id);
    //returns a list of one so index
    if (note.length > 0) {
      setMarkdown(note[0].full_markdown || note[0].markdown);
      //setActiveMarkdown(note[0].active_markdown);
      setStatus(note[0].status);
      setNoteID(note[0].note_id);
      setFullTs(note[0].full_transcript);
      setTitle(note[0].title);
      console.log("noteID", note[0].note_id);
    }
  }, [noteData, noteId]);
  //this will update the glob markdown string
  /*
  useEffect(() => {
    if (activeMarkdown) {
      setMarkdown((prevMarkdown) => prevMarkdown + activeMarkdown);
    }
  }, [activeMarkdown]);
  */

  //Grab title

  //process markdown for implemetaion

  const [markdownElements, setMarkdownElements] = useState([]);

  useEffect(() => {
    console.log(`title ${title}`);
    const splitMd = splitMarkdown(markdown);
    setMarkdownElements(splitMd);
  }, [markdown]);

  const handleDoubleClick = (clickedElement, index) => {
    // You can either play from the clicked element or accumulate text from this point
    const textFromClickedPoint = markdownElements.slice(index).join("\n\n");
    console.log(index, textFromClickedPoint);
    setSelectedText(textFromClickedPoint);
  };

  const [renderTS, setRenderTS] = useState(fullTs);
  useEffect(() => {
    setRenderTS(`${fullTs} ${status === "active" ? transcript : ""}`);
  }, [fullTs, status, transcript]);

  //use effect that sets editbody to body on load and then appends new markdown to state when added and this state is what
  const [timeoutId, setTimeoutId] = useState(null);
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      saveNoteMarkdown(noteID || noteId, markdown);
    }, 2000);

    setTimeoutId(id);

    return () => {
      clearTimeout(id);
    };
  }, [markdown]);

  const [showAlert, setShowAlert] = useState(false);

  const saveNote = () => {
    saveNoteMarkdown(noteID, markdown);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000); // hide after 5 second
  };

  return (
    <div
      className={`row h-full ${!annotating && `lg:px-40 md:px-20 sm:px-10`}`}
    >
      <SideNotes
        annotating={annotating}
        setAnnotating={setAnnotating}
        view={view}
        setView={setView}
        markdown={markdown}
        setMarkdown={setMarkdown}
        saveNote={saveNote}
        showAlert={showAlert}
        transcript={transcript}
        status={status}
        fullTs={fullTs}
        pauseProps={pauseProps}
        localNoteID={noteID}
      />

      <div
        className={`d-flex flex-column ms-2 pe-5 text-secondary h-full ${
          annotating ? "col-md-auto col-lg" : "col"
        }
        `}
      >
        <div className="mt-4 pb-2 border-bottom row d-flex align-items-center flex-lg-row">
          <div className="col-xl">
            <h1>{title}</h1>
          </div>
          <div className="col-xl-3 pe-0 mt-auto me-lg-5">
            <TextToSpeech
              markdown={markdown}
              modeKit={modeKit}
              ID={noteID}
              selectedText={selectedText}
            />
          </div>
        </div>

        <div className="overflow-auto h-full pt-2 list-disc list-inside styled-list">
          {markdownElements.map((element, index) => (
            <MarkdownElement
              key={index}
              element={element}
              handleDoubleClick={() => {
                handleDoubleClick(element, index);
              }}
            />
          ))}
          {status === "active" && <LoadNote />}
        </div>
      </div>
    </div>
  );
}

export default Noteroom;
