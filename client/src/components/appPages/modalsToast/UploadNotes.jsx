import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../hooks/auth";

const inDevelopment = import.meta.env.NODE_ENV === "development";

const UploadNotes = ({ activeNum, setPreferences, setTextareaValue }) => {
  const [file, setFile] = useState();
  const { session } = useAuth();

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);

      console.log(selectedFile);
    } else {
      console.log("Please select a PDF file.");
    }
  }

  function handleFileUpload(file, activeNum, session, setTextareaValue) {
    const token = session.access_token;

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    fetch(`${import.meta.env.VITE_BASE_URL}/settings/example_note`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (inDevelopment) console.log(data);
        const pref = data.preference;
        setPreferences((prev) => {
          const newPrefs = { ...prev };
          if (inDevelopment) {
            console.log("setting new preferences");
            console.log(newPrefs);
            console.log(newPrefs["note"][activeNum["note"]]);
          }
          newPrefs["note"][activeNum["note"]] = pref;
          return newPrefs;
        });
      });
  }

  return (
    <div className="pb-6 border-b">
      <label
        className="block text-gray-400 dark:text-white mb-2"
        htmlFor="file_input"
      >
        Upload Your own notes (PDF)
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className="text-sm relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-gray-400 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
      />
      <Button
        onClick={() => {
          if (file) {
            handleFileUpload(file, activeNum, session, setTextareaValue);
          }
        }}
        variant="secondary"
        className="bg-gray-200 mt-4"
      >
        Generate Preferences
      </Button>
    </div>
  );
};

export default UploadNotes;
