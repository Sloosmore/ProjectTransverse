import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadNote from "./noteload";
import { splitMarkdown } from "../../services/parseMarkdown";
import TextToSpeech from "../../funcComponents/textToSpeach";
import "./noteView.css";
import { saveNoteMarkdown } from "../../services/crudApi";
import SideNotes from "./sideNotes";
import MarkdownElement from "./md";

function Noteroom({ noteData, modeKit, annotatingKit, transcript }) {
  const { noteId } = useParams();
  const location = useLocation();
  const { annotating, setAnnotating } = annotatingKit;

  //needs to be edited

  const [status, setStatus] = useState(location.state.status);
  const [noteID, setNoteID] = useState(location.state.note_id);
  const [selectedText, setSelectedText] = useState("");
  const [markdown, setMarkdown] = useState(
    location.state.full_markdown || location.state.markdown
  );
  const [title, setTitle] = useState(location.state.title);

  const [fullTs, setFullTs] = useState(location.state.full_transcript);
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
    console.log(markdown);
    setMarkdownElements(splitMarkdown(markdown));
  }, [markdown]);

  const handleDoubleClick = (clickedElement, index) => {
    // You can either play from the clicked element or accumulate text from this point
    const textFromClickedPoint = markdownElements.slice(index).join("\n\n");
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
      saveNoteMarkdown(noteID, markdown);
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
    <div className="row h-100">
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
      />

      <div
        className={`d-flex flex-column vh-100 ms-2 pe-5 text-secondary col `}
      >
        <div className="mt-4 pb-2 border-bottom row d-flex align-items-center">
          <div className="col">
            <h1>{title}</h1>
          </div>
          <div className="col-3">
            <TextToSpeech
              markdown={markdown}
              modeKit={modeKit}
              ID={noteID}
              selectedText={selectedText}
            />
          </div>
        </div>

        <div className="overflow-auto flex-grow-1 pt-2">
          {markdownElements.map((element, index) => (
            <MarkdownElement
              key={index}
              element={element}
              handleDoubleClick={handleDoubleClick}
            />
          ))}
          {status === "active" && <LoadNote />}
        </div>
      </div>
    </div>
  );
}

export default Noteroom;
