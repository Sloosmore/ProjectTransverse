import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../hooks/userHooks/auth";
import { toast } from "sonner";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

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
    const fetchPromise = fetch(
      `${import.meta.env.VITE_BASE_URL}/settings/example_note`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      }
    )
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
        setTextareaValue(pref);
        return data;
      });
    toast.promise(fetchPromise, {
      loading: "Creating preferences...",
      success: (data) => {
        return `File upload successful`;
      },
      error: "Error during file upload",
    });
  }

  return (
    <div className="my-6">
      <div className="flex flex-row">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          className="me-5 text-sm relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[.58rem] text-gray-400 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.58rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.58rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
        />
        <Button
          onClick={() => {
            if (file) {
              handleFileUpload(file, activeNum, session, setTextareaValue);
            }
          }}
          variant="secondary"
          className="bg-gray-200"
        >
          Upload an Example Note
        </Button>
      </div>
    </div>
  );
};

export default UploadNotes;
