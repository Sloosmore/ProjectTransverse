import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateTitle } from "@/components/appPages/services/crudApi";

function EditTitle({ currentNote }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!title) setTitle(currentNote.title);
  }, [currentNote.title]);

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    debounceTitle(title);
  }, [title]);

  const debounceTitle = useDebouncedCallback(async (title) => {
    updateTitle(currentNote.note_id, title);
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
