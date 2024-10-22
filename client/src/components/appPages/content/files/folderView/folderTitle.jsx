import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateFolderTitle } from "@/api/crud/folder/updateTitleFolder";

function EditFolderTitle({ folder }) {
  const [title, setTitle] = useState(folder.title || "");

  useEffect(() => {
    if (!title) setTitle(folder.title || "");
  }, [folder.title, folder]);

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    debounceTitle(title);
  }, [title]);

  const debounceTitle = useDebouncedCallback(async (title) => {
    updateFolderTitle(folder.folder_id, title);
  }, 300);

  return (
    <div className="flex-grow my-4 border-0 bg-transparent	">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        className=" pb-4 w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold  bg-transparent	"
        style={{ outline: "none" }}
      />
    </div>
  );
}

export default EditFolderTitle;
