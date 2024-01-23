import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import LoadNote from "./noteload";
import { bifurcateMarkdown, splitMarkdown } from "../services/parseMarkdown";
import TextToSpeech from "../funcComponents/textToSpeach";
import "./noteView.css";

function Noteroom({ noteData, modeKit }) {
  const { noteId } = useParams();
  const location = useLocation();

  useEffect(() => {
    console.log("UUID:", noteId);
  }, [noteId]);

  const [markdown, setMarkdown] = useState(location.state.markdown);
  const [status, setStatus] = useState(location.state.status);
  const [noteID, setNoteID] = useState(location.state.note_id);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const note = noteData.filter((record) => noteId === record.note_id);
    if (note.length > 0) {
      setMarkdown(note[0].markdown);
      setStatus(note[0].status);
      setNoteID(note[0].note_id);
    }
  }, [noteData, noteId]);

  const [title, body] = bifurcateMarkdown(markdown);
  const markdownElements = splitMarkdown(body);

  const handleDoubleClick = (clickedElement, index) => {
    // You can either play from the clicked element or accumulate text from this point
    const textFromClickedPoint = markdownElements.slice(index).join("\n\n");
    setSelectedText(textFromClickedPoint);
  };

  return (
    <div className="d-flex flex-column vh-100 px-5 text-secondary">
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
  );
}

export default Noteroom;
