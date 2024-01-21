import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

function PausePlay({ pauseProps }) {
  const { mode, setMode, noteName, setNotes, noteData } = pauseProps;
  const [button, setButton] = useState();

  useEffect(() => {
    if (mode === "note") {
      setButton("pause");
      const updatedRecords = noteData.map((record) => {
        if (record.title === noteName) {
          return { ...record, status: "active" };
        } else {
          return record;
        }
      });
      setNotes(updatedRecords);
    } else if (mode === "default" && noteName) {
      setButton("play");
      const updatedRecords = noteData.map((record) => {
        return { ...record, status: "inactive" };
      });
      setNotes(updatedRecords);
    }
  }, [mode]);

  return (
    <div className="d-flex justify-content-center">
      {button === "pause" ? (
        <div
          onClick={() => setMode("default")}
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
          onClick={() => setMode("note")}
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
        content={noteName}
        id="play-tooltip"
        className="bg-light text-black-50 border"
      />
    </div>
  );
}

export default PausePlay;