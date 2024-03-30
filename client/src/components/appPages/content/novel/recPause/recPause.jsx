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
import { waveform } from "ldrs";
import { toggleGen } from "@/components/appPages/services/toggleGen.js";
import { Separator } from "@/components/ui/separator";
import "./recPause.css";
import CardTextSvg from "./svg/card-text.jsx";
import CardPicSvg from "./svg/card-pic.jsx";
import { useNoteData } from "@/hooks/noteDataStore.jsx";
import { useToast } from "@/hooks/toast.jsx";

// Default values shown

const RecPause = ({ localNoteID, ToggleGenKit }) => {
  const [recStatus, setRecStatus] = useState();
  const [viewTitle, setViewTitle] = useState();
  const [recStatusObject, setRecStatusObject] = useState();

  const { diagramOn, noteOn, setDiagramOn, setNoteOn } = ToggleGenKit;
  const { mode, setMode, noteID, noteData, setNoteID } = useNoteData();

  const { setActiveToast, setToastMessage } = useToast();

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
    setMode,
    endNoteToast,
    setNoteID,
    localNoteID,
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
  waveform.register();

  // Default values shown
  useEffect(() => {
    const doAsyncOperation = async () => {
      await toggleGen(localNoteID, noteOn, diagramOn);
    };

    doAsyncOperation();
  }, [noteOn, diagramOn]);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`flex me-2.5 align-middle ${
              recStatus !== "pause" && "ms-[22px]"
            }`}
          >
            {recStatus === "pause" && (
              <div className="me-2 mb-.5 mt-1 ">
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
      {mode === "note" && (
        <>
          <Separator orientation="vertical" />

          <button
            onClick={async () => {
              setNoteOn((prev) => !prev);
            }}
          >
            {noteOn ? (
              <div className="hover:bg-gray-100 rounded p-2.5 text-gray-500">
                <CardTextSvg />
              </div>
            ) : (
              <i
                className={`bi bi-card-text hover:bg-gray-100 rounded p-2.5`}
                style={{ fontSize: "1.1rem" }}
              ></i>
            )}
          </button>
          <button
            onClick={async () => {
              await setDiagramOn((prev) => !prev);
            }}
          >
            {diagramOn ? (
              <div className="hover:bg-gray-100 rounded p-2.5 text-gray-500">
                <CardPicSvg />
              </div>
            ) : (
              <i
                className={`bi bi-image hover:bg-gray-100 rounded p-2.5 ${
                  diagramOn && `text-gray-500 animate-colorChange`
                }`}
                style={{ fontSize: "1.1rem" }}
              ></i>
            )}
          </button>
        </>
      )}
    </TooltipProvider>
  );
};

export default RecPause;
