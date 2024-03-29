import React, { useContext } from "react";
import AudioControls from "./playback/streamAudio";

import { TranscriptContext } from "@/hooks/transcriptStore";

function Transcript({ currentNote }) {
  const { transcript } = useContext(TranscriptContext);

  const { full_transcript, status } = currentNote;
  return (
    <div className="p-6 ">
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
