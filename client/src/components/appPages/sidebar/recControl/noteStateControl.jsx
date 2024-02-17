import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import titleFromID from "../../services/noteConfig/titleFromID";
import { onPause, onPlay } from "../../services/pausePlay";
import { fetchNoteRecords } from "../../services/crudApi";
import { useAuth } from "../../../../hooks/auth";
import EndNote from "./endNote";

function PausePlay({ pauseProps }) {
  const { session } = useAuth();
  const {
    mode,
    setMode,
    noteID,
    setNotes,
    noteData,
    SpeechRecognition,
    setNoteID,
  } = pauseProps;
  //noteID = ID
  const [recStatus, setRecStatus] = useState();
  const [viewTitle, setViewTitle] = useState();

  useEffect(() => {
    setViewTitle(titleFromID(noteID, noteData));
  }, [noteID, noteData]);

  useEffect(() => {
    if (mode === "note") {
      setRecStatus("pause");
    } else if (noteID) {
      setRecStatus("play");
      //Deactivate the notes for good meause
    } else {
      setRecStatus("play");
    }
  }, [mode]);

  return (
    <div className="">
      {recStatus === "pause" ? (
        <div className="flex flew-row justify-between">
          <div
            onClick={() => {
              onPause(noteID)
                .then(() => fetchNoteRecords(session, true))
                .then((data) => {
                  setNotes(data);
                  setMode("default");
                  SpeechRecognition.stopListening();
                });
            }}
            className="btn btn-light d-flex d-flex justify-content-between align-items-center py-1 px-3 text-black-50 "
            role="button"
          >
            <i
              className="bi bi-pause-fill bi-2x align-left"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="mx-auto ps-2">Pause</span>
          </div>
          <EndNote />
        </div>
      ) : recStatus === "play" ? (
        <div className="flex flex-row justify-between">
          <div
            onClick={() => {
              onPlay(noteID, SpeechRecognition)
                .then(() => fetchNoteRecords(session, true, true))
                .then((data) => setNotes(data));
              setMode("note");
              SpeechRecognition.startListening({ continuous: true });
            }}
            className="btn btn-light d-flex align-d-flex justify-content-between align-items-center py-1 px-3 text-black-50 "
            role="button"
            data-tooltip-id="play-tooltip"
          >
            <i
              className="bi bi-record2 bi-2x align-left"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="mx-auto ps-2">Capture</span>
          </div>
          <EndNote />
        </div>
      ) : recStatus === "new" ? (
        <></>
      ) : null}
      <ReactTooltip
        key={viewTitle}
        place="right"
        content={viewTitle || titleFromID(noteID, noteData)}
        id="play-tooltip"
        className="bg-light text-black-50 border"
      />
    </div>
  );
}

export default PausePlay;
