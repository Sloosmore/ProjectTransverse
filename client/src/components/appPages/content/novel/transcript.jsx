import React from "react";

function Transcript({ currentNote, transcript }) {
  const { full_transcript, status } = currentNote;
  return (
    <div className="p-6 text-secondary">
      {full_transcript &&
        full_transcript.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      {status === "active" && transcript}
    </div>
  );
}
export default Transcript;
