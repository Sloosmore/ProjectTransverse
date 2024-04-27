import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateTitle } from "@/components/appPages/services/crudApi";
import { fetchNoteRecords } from "@/components/appPages/services/crudApi";
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
    await fetchNoteRecords(session, true).then((data) => {
      setNotes(data);
    });
  }, 1500);

  return (
    <div className="flex-grow md:px-12 px-6 mt-8">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        className="border-b pb-4 w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold"
        style={{ outline: "none" }}
      />
    </div>
  );
}

export default EditTitle;
