import React, { useEffect, useState } from "react";
import getRecStatusArray from "./statusArray.jsx";
import { useAuth } from "@/hooks/auth.jsx";
import { fetchNoteRecords } from "@/components/appPages/services/crudApi.js";
import { onPause, onPlay } from "@/components/appPages/services/pausePlay.js";
import titleFromID from "@/components/appPages/services/frontendNoteConfig/titleFromID.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "ldrs/waveform";

const RecPause = ({ pauseProps, localNoteID }) => {
  const [recStatus, setRecStatus] = useState();
  const [viewTitle, setViewTitle] = useState();
  const [recStatusObject, setRecStatusObject] = useState();

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
  const { setActiveToast, setToastMessage, activeToast, toastMessage } =
    submitToastKit;

  const endNoteToast = () => {
    setToastMessage("Recording Sesstion ended");
    setActiveToast(true);
    setTimeout(() => {
      setActiveToast(false);
    }, 5000);
  };

  const recStatusArray = getRecStatusArray({
    onPause,
    onPlay,
    noteID,
    fetchNoteRecords,
    session,
    setNotes,
    setMode,
    endNoteToast,
    SpeechRecognition,
    setNoteID,
    localNoteID,
    viewTitle,
  });

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

  useEffect(() => {
    const newRec = recStatusArray.find(
      (status) => status.recStatus === recStatus
    );
    console.log(newRec);
    setRecStatusObject(newRec);
  }, [recStatus]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex me-2.5 align-middle ">
            {recStatus === "pause" && (
              <div className="me-2 mb-.5 mt-1">
                <l-waveform
                  size="15"
                  stroke="2"
                  speed="1.2"
                  color="gray"
                ></l-waveform>
              </div>
            )}

            <div
              onClick={() => {
                recStatusObject.leftFunction();
              }}
              className=""
            >
              <i
                className={`${
                  recStatusObject?.leftIcon || ""
                } align-middle my-auto hover:bg-gray-100 rounded p-2.5`}
                style={{ fontSize: "1.2rem" }}
              ></i>
            </div>
            <div
              onClick={() => {
                recStatusObject.rightFunction();
              }}
              className=""
            >
              <i
                className={`${
                  recStatusObject?.rightIcon || ""
                } align-middle my-auto hover:bg-gray-100 rounded p-2.5`}
              ></i>
            </div>
          </div>
        </TooltipTrigger>
        {recStatus === "lock" && (
          <TooltipContent>
            <div>end the note {viewTitle}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default RecPause;
