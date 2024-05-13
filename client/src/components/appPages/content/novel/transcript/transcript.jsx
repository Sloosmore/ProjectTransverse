import React, { useContext, useEffect, useState } from "react";
import { TranscriptContext } from "@/hooks/noteHooks/transcriptStore";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { pulsar } from "ldrs";
import { useAuth } from "@/hooks/userHooks/auth";
import { useParams } from "react-router-dom";
import { reduceTranscript } from "@/components/appPages/services/transcriptFormating/transcriptReducer";

// Default values shown

function Transcript({ currentNote }) {
  const { full_transcript, json_transcript, status } = currentNote;

  const { noteId } = useParams();
  pulsar.register();
  const { mode } = useNoteData();
  const { fullTranscript, caption } = useContext(TranscriptContext);
  const { userType } = useAuth();
  const { noteID } = useNoteData();
  const [transcriptData, setTranscriptData] = useState([]);

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

  useEffect(() => {
    console.log("full_transcript", fullTranscript);
    console.log("json_transcript", json_transcript);
  }, [fullTranscript]);

  useEffect(() => {
    console.log("caption update", caption);
  }, [caption]);

  useEffect(() => {
    setTranscriptData([
      ...(Array.isArray(json_transcript) ? json_transcript : []),
      ...(Array.isArray(fullTranscript) && noteID === noteId
        ? fullTranscript
        : []),
      ...(Array.isArray(caption) && noteID === noteId ? caption : []),
    ]);
  }, [json_transcript, fullTranscript, caption]);

  useEffect(() => {
    console.log("ts", transcriptData);
    console.log("reducing", reduceTranscript([...transcriptData]));
    console.log("ts", transcriptData);
  }, [transcriptData]);

  return (
    <div className="p-6 ">
      <div>
        {userType === "Premium" && full_transcript.length === 0 ? (
          (json_transcript || fullTranscript || caption) && (
            <>
              {reduceTranscript(transcriptData).map((line, index) => (
                <div key={index}>
                  {line.caption}
                  <br />
                </div>
              ))}
            </>
          )
        ) : (
          <div>
            {(full_transcript || "").split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
            {status === "active" && fullTranscript}
          </div>
        )}
      </div>

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
