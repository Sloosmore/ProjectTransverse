import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import titleFromID from "../services/titleFromID";
import { onPause, onPlay } from "../services/pausePlay";
import { fetchNoteRecords } from "../services/crudApi";

function PausePlay({ pauseProps }) {
  const { mode, setMode, noteID, setNotes, noteData } = pauseProps;
  //noteID = ID
  const [button, setButton] = useState();

  useEffect(() => {
    if (mode === "note") {
      setButton("pause");
    } else if (mode === "default" && noteID) {
      setButton("play");
      //Deactivate the notes for good meause
    }
  }, [mode]);

  return (
    <div className="d-flex justify-content-center">
      {button === "pause" ? (
        <div
          onClick={() => {
            onPause(noteID)
              .then(() => fetchNoteRecords(true))
              .then((data) => {
                setNotes(data);
                setMode("default");
              });
          }}
          className="btn btn-light d-flex d-flex justify-content-between align-items-center py-1 px-3 text-black-50 "
          style={{ width: "85%" }}
          role="button"
        >
          <i
            className="bi bi-pause-fill bi-2x align-left"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <span className="mx-auto">Pause</span>
        </div>
      ) : button === "play" ? (
        <div
          onClick={() => {
            onPlay(noteID)
              .then(() => fetchNoteRecords(true, true))
              .then((data) => setNotes(data));
            setMode("note");
          }}
          style={{ width: "85%" }}
          className="btn btn-light d-flex align-d-flex justify-content-between align-items-center py-1 px-3 text-black-50 "
          role="button"
          data-tooltip-id="play-tooltip"
        >
          <i
            className="bi bi-record2 bi-2x align-left"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <span className="mx-auto">Capture</span>
        </div>
      ) : null}
      <ReactTooltip
        place="right"
        content={titleFromID(noteID, noteData)}
        id="play-tooltip"
        className="bg-light text-black-50 border"
      />
    </div>
  );
}

export default PausePlay;
