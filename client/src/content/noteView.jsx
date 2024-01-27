import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import LoadNote from "./noteload";
import { bifurcateMarkdown, splitMarkdown } from "../services/parseMarkdown";
import TextToSpeech from "../funcComponents/textToSpeach";
import "./noteView.css";
import { saveNoteRecord } from "../services/sidebarTasksApi";

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
  const [fullTs, setFullTs] = useState(location.state.full_transcript);
  const [activeMarkdown, setActiveMarkdown] = useState("");

  const [view, setView] = useState("notes");

  useEffect(() => {
    //grabs from notedata
    const note = noteData.filter((record) => noteId === record.note_id);
    //returns a list of one so index
    if (note.length > 0) {
      setMarkdown(note[0].markdown);
      setActiveMarkdown(note[0].active_markdown);
      setStatus(note[0].status);
      setNoteID(note[0].note_id);
      setFullTs(note[0].full_transcript);
    }
  }, [noteData, noteId]);
  //this will update the glob markdown string
  useEffect(() => {
    setMarkdown((prevMarkdown) => prevMarkdown + activeMarkdown);
  }, [activeMarkdown]);

  //Grab title

  //process markdown for implemetaion
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [markdownElements, setMarkdownElements] = useState([]);

  useEffect(() => {
    const [newTitle, newBody] = bifurcateMarkdown(markdown);
    setTitle(newTitle);
    setBody(newBody);
    setMarkdownElements(splitMarkdown(newBody));
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
      saveNoteRecord(noteID, body);
    }, 5000);

    setTimeoutId(id);

    return () => {
      clearTimeout(id);
    };
  }, [body]);

  return (
    <div className="row h-100">
      <div
        style={{ height: "100vh" }}
        className={`${annotating ? "col-7" : "col-auto"} transition-sidebar 
        `}
      >
        <div className="row h-100">
          <div
            className={`toggle-sidebar d-flex align-items-center col-1 ${
              annotating && "bg-lightgrey"
            }`}
          >
            {annotating && (
              <i
                className="bi bi-caret-right text-white"
                style={{ fontSize: "2rem" }}
                onClick={() => setAnnotating(!annotating)}
              ></i>
            )}
            {!annotating && (
              <i
                className="bi bi-caret-left text-secondary"
                style={{ fontSize: "2rem" }}
                onClick={() => setAnnotating(!annotating)}
              ></i>
            )}
          </div>
          {annotating && (
            <div className="col-10 ms-4 text-secondary">
              <ul className="nav nav-underline mt-5">
                <li className="nav-item">
                  <button
                    className={`nav-link text-secondary ${
                      view === "notes" ? "active" : ""
                    }`}
                    onClick={() => setView("notes")}
                  >
                    <h5>Notes</h5>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link text-secondary ${
                      view === "transcript" ? "active" : ""
                    }`}
                    onClick={() => setView("transcript")}
                  >
                    <h5>Transcript</h5>
                    <div className="overflow-auto flex-grow-1 pt-2"></div>
                  </button>
                </li>
              </ul>
              {view === "notes" && (
                <textarea
                  className="form-control mt-3 text-secondary"
                  id="exampleFormControlTextarea1"
                  style={{ height: "80vh", overflow: "auto", resize: "none" }}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              )}
              {view === "transcript" && <div>Transcript View</div>}
            </div>
          )}
        </div>
      </div>

      <div
        className={`d-flex flex-column vh-100 ms-2 pe-5 text-secondary col `}
      >
        <div className="mt-4 pb-2 border-bottom row d-flex align-items-center">
          <div className="col">
            <ReactMarkdown>{title}</ReactMarkdown>
          </div>
          <div className="col-3">
            <TextToSpeech
              markdown={body}
              modeKit={modeKit}
              ID={noteID}
              selectedText={selectedText}
            />
          </div>
        </div>

        <div className="overflow-auto flex-grow-1 pt-2">
          {markdownElements.map((element, index) => (
            <div
              key={index}
              onDoubleClick={() => handleDoubleClick(element, index)}
            >
              <ReactMarkdown>{element}</ReactMarkdown>
            </div>
          ))}
          {status === "active" && <LoadNote />}
        </div>
      </div>
    </div>
  );
}

export default Noteroom;
