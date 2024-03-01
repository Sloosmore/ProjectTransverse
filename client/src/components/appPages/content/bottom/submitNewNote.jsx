import React, { useState, useEffect, useRef } from "react";
import "./submit.css";

import { createNewNote } from "../../services/noteWebsockets/noteModeApi";
import { useAuth } from "../../../../hooks/auth";

function SubmitNewNote({ controlProps, noteData }) {
  const { session } = useAuth();
  const [localNoteName, localNoteNameSet] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const noteRef = useRef(null);

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

    createNewNote(
      localNoteName,
      transcript,
      noteData,
      setNotes,
      setMode,
      wsJSON,
      session,
      SpeechRecognition
    );

    setToastMessage("Note Started, look in the notes tab");
    setActiveToast(true);
    setTimeout(() => {
      setActiveToast(false);
    }, 5000);
  };
  useEffect(() => {
    if (newNoteField) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [newNoteField]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setNewNoteField(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [noteRef, setNewNoteField]);

  return (
    <>
      {newNoteField && (
        <div className="w-full mx-auto z-20 relative overflow-x-hidden">
          <div className="absolute inset-0 blur-shadow "></div>
          <div
            ref={noteRef}
            className={`lg:w-3/4 md:w-5/6 sm:w-11/12 mx-auto z-10 transition-opacity duration-300 p-5 `}
          >
            <div className=" flex flex-row overflow-hidden bg-white [&:has(textarea:focus)]:border-token-border-xheavy shadow-lg w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy rounded-2xl bg-token-main-surface-primary shadow-lg">
              <input
                type="text"
                className="m-0 w-full resize-none border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 max-h-25 py-[10px] pr-4 md:py-3.5 md:pr-12 placeholder-gray-400 dark:placeholder-opacity-100 pl-4 text-gray-800"
                placeholder="Drop the title here! The title is important because it will help with prompting."
                onChange={(e) => localNoteNameSet(e.target.value)}
              />
              <button
                className="w-10 h-10 flex-shrink-0 bottom-0 right-0 rounded-lg border border-gray-500 bg-gray-500 text-white transition-colors disabled:text-gray-400 disabled:opacity-10 dark:border-white my-auto me-2"
                onClick={() => handleNoteSubmit()}
              >
                <i
                  className="bi bi-arrow-up-short"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SubmitNewNote;
