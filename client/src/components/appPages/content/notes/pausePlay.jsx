import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import titleFromID from "../../services/frontendNoteConfig/titleFromID";
import { onPause, onPlay } from "../../services/pausePlay";
import { fetchNoteRecords } from "../../services/crudApi";
import { useAuth } from "../../../../hooks/auth";

function Record({ pauseProps, localNoteID }) {
  const { session } = useAuth();
  const {
    mode,
    setMode,
    noteID,
    setNotes,
    noteData,
    SpeechRecognition,
    setNewNoteField,
    newNoteField,
    setNoteID,
    submitToastKit,
  } = pauseProps;

  const { activeToast, toastMessage, setActiveToast, setToastMessage } =
    submitToastKit;
  //noteID = ID
  const [recStatus, setRecStatus] = useState();
  const [viewTitle, setViewTitle] = useState();

  const endNoteToast = () => {
    setToastMessage("Recording Sesstion ended");
    setActiveToast(true);
    setTimeout(() => {
      setActiveToast(false);
    }, 5000);
  };

  useEffect(() => {
    setViewTitle(titleFromID(noteID, noteData));
  }, [noteID, noteData]);

  useEffect(() => {
    console.log("typeof noteID:", typeof noteID);
    if (mode === "note" && noteID === localNoteID) {
      setRecStatus("pause");
    } else if (noteID === localNoteID) {
      setRecStatus("play");
      //Deactivate the notes for good meause
    } else if (!noteID || noteID === "undefined" || noteID === null) {
      setRecStatus("unlock");
    } else {
      setRecStatus("lock");
      //need to unlock the note by hitting square in current note
    }
  }, [mode, noteID]);

  return (
    <div className="flex flew-row justify-between mb-2">
      {recStatus === "pause" ? (
        <div className="bg-gray-100 inline-flex shadow-sm ring-1 ring-inset ring-gray-300 rounded-md">
          <button
            onClick={() => {
              onPause(noteID)
                .then(() => fetchNoteRecords(session, true))
                .then((data) => {
                  setNotes(data);
                  setMode("default");
                  SpeechRecognition.stopListening();
                });
            }}
            className="bg-gray-100 inline-flex justify-center ps-3.5 pe-3.5 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-200 rounded-md"
            role="button"
          >
            <i
              className="bi bi-pause-fill bi-2x align-left my-auto mx-1.5"
              style={{ fontSize: "1.75rem" }}
            ></i>
          </button>
          <button
            onClick={() => {
              onPause(noteID)
                .then(() => fetchNoteRecords(session, true))
                .then((data) => {
                  setNotes(data);
                  setMode("default");
                  SpeechRecognition.stopListening();
                });
              setNoteID(null);
              endNoteToast();
            }}
            className=" inline-flex justify-center  px-4 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-200 my-auto rounded-md"
          >
            <i
              className="bi bi-square-fill my-auto"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </button>
        </div>
      ) : recStatus === "play" ? (
        <div className="bg-gray-100 inline-flex shadow-sm ring-1 ring-inset ring-gray-300 rounded-md">
          <button
            onClick={() => {
              onPlay(noteID)
                .then(() => fetchNoteRecords(session, true, true))
                .then((data) => setNotes(data));
              setMode("note");
              SpeechRecognition.startListening({ continuous: true });
            }}
            className="bg-gray-100 inline-flex justify-center ps-3.5 pe-3.5 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-200 rounded-md"
            role="button"
          >
            <i
              className="bi bi-record2 bi-2x align-left my-auto mx-1.5"
              style={{ fontSize: "1.75rem" }}
            ></i>
          </button>
          <button
            onClick={() => {
              setNoteID();
              endNoteToast();
            }}
            className=" inline-flex justify-center  px-4 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-200 my-auto rounded-md"
          >
            <i
              className="bi bi-square-fill my-auto"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </button>
        </div>
      ) : recStatus === "unlock" ? (
        <div className="bg-gray-100 inline-flex shadow-sm ring-1 ring-inset ring-gray-300 rounded-md">
          <button
            onClick={() => {
              //need to set active note here as well
              setNoteID(localNoteID);
              onPlay(localNoteID)
                .then(() => fetchNoteRecords(session, true, true))
                .then((data) => setNotes(data));
              setMode("note");
              SpeechRecognition.startListening({ continuous: true });
            }}
            className="bg-gray-100 inline-flex justify-center ps-3.5 pe-3.5 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-200 rounded-md"
            role="button"
          >
            <i
              className="bi bi-record2 bi-2x align-left my-auto mx-1.5"
              style={{ fontSize: "1.75rem" }}
            ></i>
          </button>
          <button
            onClick={() => setNoteID()}
            className=" inline-flex justify-center  px-4 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-200 my-auto rounded-md"
          >
            <i
              className="bi bi-square-fill my-auto"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </button>
        </div>
      ) : recStatus === "lock" ? (
        <div
          className="bg-gray-100 inline-flex shadow-sm ring-1 ring-inset ring-gray-300 rounded-md"
          data-tooltip-id="play-tooltip"
        >
          <button
            className="bg-gray-100 inline-flex justify-center ps-3.5 pe-3.5 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-200 rounded-md"
            role="button"
          >
            <i
              className="bi bi-record2 bi-2x align-left my-auto mx-1.5"
              style={{ fontSize: "1.75rem" }}
            ></i>
          </button>
          <button className=" inline-flex justify-center  px-4 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-200 my-auto rounded-md">
            <i
              className="bi bi-square-fill my-auto"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </button>
        </div>
      ) : (
        "lololo"
      )}
      <ReactTooltip
        key={viewTitle}
        place="left"
        content={`end the current note to record on another: ${
          viewTitle || titleFromID(noteID, noteData)
        }`}
        id="play-tooltip"
        className="bg-light text-black-50 border"
      />
    </div>
  );
}

export default Record;
