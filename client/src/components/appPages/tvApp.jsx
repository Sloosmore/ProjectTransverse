import "regenerator-runtime";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import "./tvApp.css";
import { AppRoutes } from "./content/routes";
import "bootstrap-icons/font/bootstrap-icons.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { handleOnMessage } from "./services/noteWebsockets/wsResponce";
import { deactivateNotes, fetchNoteRecords } from "./services/crudApi";
import titleFromID from "./services/frontendNoteConfig/titleFromID";
import { useAuth } from "../../hooks/auth";
import SupportedToast from "./support/supportedBrowser";
import NoAudioSupport from "./support/noSupport";
import SubmitToast from "./modalsToast/submitToast";
import { useNavigate } from "react-router-dom";
import { stopRecordingMedia } from "./services/audio/mediaRecorder";
import { TranscriptContext } from "@/hooks/transcriptStore";
import { NoteDataContext } from "@/hooks/noteDataStore";
import { onPause } from "./services/pausePlay";

const WS_URL = `${import.meta.env.VITE_WS_SERVER_URL}/notes-api`;

function TransverseApp() {
  const navigate = useNavigate();

  const { session } = useAuth();
  //this is for help

  //this is for note vs default mode
  const [mode, setMode] = useState("default");

  //this is for notes in sidebar
  const [noteData, setNotes] = useState([]);

  //this is for specific active instace of WS notes
  //ID of note and not title use titleFromID to get title
  const [noteID, setNoteID] = useState(localStorage.getItem("noteID") || "");

  //hide the sidebar while editing notes
  //for editing notes in files link
  const [showOffCanvasEdit, setOffCanvasEdit] = useState(false);

  //for new note toast
  const [activeToast, setActiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  //this is for note field
  const [newNoteField, setNewNoteField] = useState(false);

  //this is for the media recorder
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    localStorage.setItem("noteID", noteID);
  }, [noteID]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },

    onMessage: (event) => {
      handleOnMessage(
        event,
        noteData,
        setNoteID,
        setNotes,
        noteID,
        resetTranscript,
        navigate,
        SpeechRecognition,
        setRecorder,
        session
      );
    },

    onError: (event) => {
      console.error("WebSocket error observed:", event);
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  // Mic Failsafe functions -----------------------------------------------------------------------------
  //so timerFailsame does not call UseEffect
  useEffect(() => {
    console.log("listening effect triggered");
    console.log("mode", mode);
    if (!listening && mode === "note") {
      setTimeout(() => {
        if (mode === "note") {
          SpeechRecognition.startListening({ continuous: true });
          console.log("Restart after trgger");
        } else {
          return;
        }
      }, 100);
    }
  }, [listening]);

  useEffect(() => {
    console.log("updated mode", mode);

    const handleBeforeUnload = (e) => {
      onPause(noteID, new Date());
      setMode("default");
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave?";
      return "Are you sure you want to leave?";
    };

    if (mode === "note") {
      // Adding the event listener when in 'note' mode
      setTimeout(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
      }, 1000);
    } else if (mode === "default") {
      // Removing the event listener when in 'default' mode
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [mode]);

  // ------------------------------------------------------------------------------------------------

  if (!browserSupportsSpeechRecognition) {
    console.log("Browser doesnt support speech recognition.");
    return <NoAudioSupport />;
  }

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (mode !== "note") {
      stopRecordingMedia(recorder);
      console.log("Listening stopped");
      setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 500);
    }
  }, [mode]);

  //core logic for note mode
  useEffect(() => {
    if (mode === "note") {
      //send to backend after 2 sec
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const backID = setTimeout(() => {
        if (mode === "note") {
          console.log("reset and sending to back");

          SpeechRecognition.startListening({ continuous: true });

          const title = titleFromID(noteID, noteData);

          sendJsonMessage({
            title,
            transcript: transcript,
            init: false,
            note_id: noteID,
            token: session.access_token,
          });
        } else {
          SpeechRecognition.stopListening();
        }
      }, 3250);
      setTimeoutId(backID);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
        SpeechRecognition.stopListening();
      }
    }
  }, [transcript]);

  //ping pong to keep WS connection alive
  useEffect(() => {
    //fetchTaskRecords().then(setDocs);
    const ping = setInterval(() => {
      sendJsonMessage({ ping: true });
      console.log("ping");
    }, 30000);

    //if deactivate any active notes
    deactivateNotes(session).then((data) => {
      setNotes(data);
    });

    return () => {
      clearInterval(ping);
    };
  }, []);

  useEffect(() => {
    fetchNoteRecords(session, true).then(setNotes);
  }, [showOffCanvasEdit]);

  const submitToastKit = {
    setActiveToast,
    setToastMessage,
    activeToast,
    toastMessage,
  };
  const canvasEdit = {
    showOffCanvasEdit,
    setOffCanvasEdit,
  };

  const controlProps = {
    setNotes,
    wsJSON: sendJsonMessage,
    setMode,
    resetTranscript,
    setActiveToast,
    setToastMessage,
    SpeechRecognition,
    newNoteField,
    setNewNoteField,
  };

  const pauseProps = {
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
    recorder,
    setRecorder,
  };

  const modeKit = {
    mode,
    setMode,
    noteData,
    setNotes,
  };

  const newNoteButtonkit = {
    setNewNoteField,
    newNoteField,
    noteID,
  };

  return (
    <div className="flex flex-col h-screen">
      <NoteDataContext.Provider
        value={{ noteData, setNotes, noteID, setNoteID, mode, setMode }}
      >
        <TranscriptContext.Provider value={{ transcript }}>
          <AppRoutes
            noteData={noteData}
            modeKit={modeKit}
            canvasEdit={canvasEdit}
            controlProps={controlProps}
            newNoteButtonkit={newNoteButtonkit}
            pauseProps={pauseProps}
          />
          <SupportedToast />
          <SubmitToast {...submitToastKit} />
        </TranscriptContext.Provider>
      </NoteDataContext.Provider>
    </div>
  );
}

export default TransverseApp;
