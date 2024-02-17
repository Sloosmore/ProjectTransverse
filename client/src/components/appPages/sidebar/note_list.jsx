import Task from "./task";
import { Link, useNavigate } from "react-router-dom";

function NoteList({ notes }) {
  if (!notes) {
    return null; // or return a loading spinner, or some placeholder content
  }

  const navigate = useNavigate();

  const goToTask = (notes) => {
    navigate(`/n/${notes.note_id}`, {
      state: {
        title: notes.title,
        id: notes.note_id,
        markdown: notes.full_markdown,
        status: notes.status,
      },
    });
  };

  return (
    <div className="mb-3">
      <div>
        {notes.map((note, index) => (
          <div
            key={index}
            onClick={() => goToTask(note)}
            style={{ cursor: "pointer" }}
          >
            <Task
              name={(note.title || note.note_id).substring(0, 15)}
              state={note.status}
            />
            {}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoteList;
