import React, { useContext, useEffect, useState } from "react";
import { TranscriptContext } from "@/hooks/noteHooks/transcriptStore";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { pulsar } from "ldrs";
import { useAuth } from "@/hooks/userHooks/auth";
import { useParams } from "react-router-dom";
import { reduceTranscript } from "@/components/appPages/services/transcriptFormating/transcriptReducer";
import SpeakerCaption from "./speakerIdetification";

// Default values shown

function Transcript({ currentNote }) {
  const { full_transcript, json_transcript, status } = currentNote;

  const { noteId } = useParams();
  pulsar.register();
  const { mode, setNotes } = useNoteData();
  const { fullTranscript, caption, setFullTranscript } =
    useContext(TranscriptContext);
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
    setTranscriptData(
      reduceTranscript([
        ...(Array.isArray(json_transcript) ? json_transcript : []),
        ...(Array.isArray(fullTranscript) && noteID === noteId
          ? fullTranscript
          : []),
        ...(Array.isArray(caption) && noteID === noteId ? caption : []),
      ])
    );
  }, [json_transcript, fullTranscript, caption]);

  useEffect(() => {
    console.log("ts", transcriptData);
    console.log("reducing", reduceTranscript([...transcriptData]));
    console.log("ts", transcriptData);
  }, [transcriptData]);

  return (
    <div className="px-6 pb-6 pt-2">
      <div>
        {userType === "Premium" ? (
          <div>
            {transcriptData.length > 0 && (
              <>
                {transcriptData.map((line, index) => (
                  <SpeakerCaption speak={line} key={index} />
                ))}
              </>
            )}
          </div>
        ) : userType !== "None" ? (
          <div>
            {typeof full_transcript === "string" &&
              (full_transcript || "").split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            {status === "active" && fullTranscript}
          </div>
        ) : (
          <div className="text-4xl">loading</div>
        )}
      </div>
      {processing && (
        <div className="flex justify-between items-center md:flex-row flex-col h-20 mx-3 border-t mt-5 md:pt-5 pt-4 ">
          <p className=" italic sm:h-24 h-48 flex items-center md:ms-2 md:mx-0 mx-auto">
            Processing last audio. Please wait to view the transcript if you
            start recording again.
          </p>
          <div className="h-full sm:flex mt-5 items-center mx-4 md:mt-1">
            <l-pulsar size="40" speed="1.75" color="gray"></l-pulsar>
          </div>
        </div>
      )}
    </div>
  );
}
export default Transcript;
