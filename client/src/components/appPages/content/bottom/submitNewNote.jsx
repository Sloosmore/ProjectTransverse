import React, { useState } from "react";
import { createNewNote } from "../../services/noteWebsockets/noteModeApi";
import { useAuth } from "../../../../hooks/auth";

function SubmitNewNote({ controlProps, noteData }) {
  const { session } = useAuth();
  const [localNoteName, localNoteNameSet] = useState("");

  const {
    setNotes,
    wsJSON,
    setMode,
    resetTranscript,
    setActiveToast,
    setToastMessage,
    SpeechRecognition,
    newNoteField,
    setNewNoteField,
  } = controlProps;

  const handleNoteSubmit = () => {
    //no longer will have transcript
    const transcript = "";
    setNewNoteField(false);
    /*
    createNewNote(
      localNoteName,
      transcript,
      noteData,
      setNotes,
      setMode,
      wsJSON,
      session,
      SpeechRecognition
    );*/
    //.then() -> setToastMessage();
    localStorage.setItem("noteID", noteID);

    setToastMessage("Note Started, look in the notes tab");
    setActiveToast(true);
    setTimeout(() => {
      setActiveToast(false);
    }, 5000);
  };

  return (
    newNoteField && (
      <div className={`w-5/6 mx-auto z-10 transition-opacity duration-300`}>
        <div className=" flex flex-row overflow-hidden bg-white [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy rounded-2xl bg-token-main-surface-primary shadow-lg">
          <input
            type="text"
            className="m-0 w-full resize-none border-0  focus:ring-0 focus:outline-none focus-visible:ring-0 max-h-25 py-[10px] pr-10 md:py-3.5 md:pr-12 placeholder-gray-400 dark:placeholder-opacity-100 pl-4 text-gray-800"
            placeholder="Drop the title here! The title is important because it will help with prompting."
            onChange={(e) => localNoteNameSet(e.target.value)}
          />
          <button
            className="w-10 h-10 bottom-0 right-0 rounded-lg border border-gray-500 bg-gray-500 text-white transition-colors disabled:text-gray-400 disabled:opacity-10 dark:border-white my-auto me-2"
            onClick={() => handleNoteSubmit()}
          >
            <i
              className="bi bi-arrow-up-short"
              style={{ fontSize: "1.5rem" }}
            ></i>
          </button>
        </div>
      </div>
    )
  );
}

export default SubmitNewNote;
