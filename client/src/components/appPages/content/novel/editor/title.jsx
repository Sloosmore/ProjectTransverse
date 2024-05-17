import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateTitle } from "@/api/crud/notes/updateTitle";
import { fetchNoteRecords } from "@/api/crud/notes/readNotes";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { useAuth } from "@/hooks/userHooks/auth";

function EditTitle({ currentNote }) {
  const [title, setTitle] = useState(currentNote.title || "");
  const { setNotes } = useNoteData();
  const { session } = useAuth();

  useEffect(() => {
    if (!title) setTitle(currentNote.title || "");
  }, [currentNote.title]);

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    debounceTitle(title);
  }, [title]);

  const debounceTitle = useDebouncedCallback(async (title) => {
    await updateTitle(currentNote.note_id, title);
    await fetchNoteRecords(session).then((data) => {
      setNotes(data);
    });
  }, 400);

  return (
    <div className="flex-grow md:px-12 px-6 mt-8 bg-transparent	 ">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        className="w-full font-semibold bg-transparent overflow-ellipsis overflow-hidden	"
        style={{ outline: "none", fontSize: "3em" }}
        placeholder="Title here..."
      />
    </div>
  );
}

export default EditTitle;
