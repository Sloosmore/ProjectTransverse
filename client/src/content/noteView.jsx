import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import LoadNote from "./noteload";
import { splitMarkdown } from "../services/parseMarkdown";
import TextToSpeech from "../funcComponents/tts";

function Noteroom({ noteData, modeKit }) {
  const { noteId } = useParams();
  const location = useLocation();
  const { mode, setMode } = modeKit;

  useEffect(() => {
    console.log("UUID:", noteId);
  }, [noteId]);

  const [markdown, setMarkdown] = useState(location.state.markdown);
  const [status, setStatus] = useState(location.state.status);

  useEffect(() => {
    const note = noteData.filter((record) => noteId === record.note_id);
    if (note.length > 0) {
      setMarkdown(note[0].markdown);
      setStatus(note[0].status);
    }
  }, [noteData, noteId]);
  const [title, body] = splitMarkdown(markdown);

  return (
    <div className="d-flex flex-column vh-100 px-5 text-secondary">
      <div className="mt-4 pb-2 border-bottom row d-flex align-items-center">
        <div className="col">
          <ReactMarkdown>{title}</ReactMarkdown>
        </div>
        <div className="col-3">
          <TextToSpeech text={body} modeKit={modeKit} />
        </div>
      </div>
      <div className="overflow-auto flex-grow-1 pt-2">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
      {status === "active" && <LoadNote />}
    </div>
  );
}

export default Noteroom;
