import React, { useContext, useEffect, useState } from "react";
import AudioControls from "./playback/streamAudio";

import { TranscriptContext } from "@/hooks/transcriptStore";
import { useNoteData } from "@/hooks/noteDataStore";
import { pulsar } from "ldrs";

// Default values shown

function Transcript({ currentNote }) {
  pulsar.register();
  const { mode } = useNoteData();
  const { fullTranscript, caption } = useContext(TranscriptContext);

  const [processing, setProcessing] = useState(false);
  const [processingFlag, setProcessingFlag] = useState(false);

  useEffect(() => {
    if (mode === "default" && processingFlag) {
      const timeout = 12000;
      setProcessing(true);

      setTimeout(() => {
        setProcessing(false);
      }, timeout);
    }
    if (mode === "note") {
      setProcessingFlag(true);
    }
  }, [mode]);

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
      {status === "active" && fullTranscript + " " + caption}

      {processing && (
        <div className="flex justify-between items-center flex-row h-20 mx-3 border-t mt-5">
          <p className=" mt-3  italic h-full flex items-center ms-2">
            Processing the last audio file. Please wait a few seconds to view
            the a transcript if you start recording again.
          </p>
          <div className="h-full flex items-center mx-4 mt-1">
            <l-pulsar size="40" speed="1.75" color="gray"></l-pulsar>
          </div>
        </div>
      )}
    </div>
  );
}
export default Transcript;
