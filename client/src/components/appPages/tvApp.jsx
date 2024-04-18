import "regenerator-runtime";
import { useState, useEffect, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import { stopRecordingMedia } from "./services/audio/mediaRecorder";
import { TranscriptContext } from "@/hooks/transcriptStore";
import { NoteDataContext } from "@/hooks/noteDataStore";
import { onPause } from "./services/pausePlay";
import { startRecordingMedia } from "./services/audio/mediaRecorder";
import { ToastProvider } from "@/hooks/toast";
import { NewNoteProvider } from "@/hooks/newNote";
import { useQueue } from "@uidotdev/usehooks";
import { fetchDeepGramKey } from "./services/audio/deepgram";
import { LiveTranscriptionEvents, createClient } from "@deepgram/sdk";
import { toast } from "sonner";
import { useBrowser } from "@/hooks/browserSupport";
import { useUserPref } from "@/hooks/userPreff";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";
console.log("inDevelopment", inDevelopment);
const WS_URL = `${import.meta.env.VITE_WS_SERVER_URL}/notes-api`;

function TransverseApp() {
  const { compatible } = useBrowser();
  const navigate = useNavigate();
  const { session, userType } = useAuth();
  const { frequency } = useUserPref();
  //this is for note vs default mode
  const [mode, setMode] = useState("default");
  //this is for notes in sidebar
  const [noteData, setNotes] = useState([]);
  //this is for specific active instace of WS notes
  //ID of note and not title use titleFromID to get title
  const [noteID, setNoteID] = useState(localStorage.getItem("noteID") || null);
  //this is for the media recorder
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    if (inDevelopment) {
      console.log("freq", frequency);
    }
  }, []);
  //state for deepgram

  const { add, remove, first, size, queue } = useQueue([]);
  const [apiKey, setApiKey] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isListening, setListening] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [microphone, setMicrophone] = useState(null);
  const [userMedia, setUserMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");

  const startDGMicrophone = useCallback(async () => {
    // Set up mediaRecorder and getUserMedia
    console.log("starting deep microphone");
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const microphone = new MediaRecorder(userMedia);
    microphone.start(500);

    microphone.ondataavailable = (e) => {
      add(e.data);
    };

    setUserMedia(userMedia);
    setMicrophone(microphone);
  }, [add]);

  const stopDGMicrophone = useCallback(() => {
    // Kill microphone if it's on
    if (microphone && userMedia) {
      setUserMedia(null);
      setMicrophone(null);

      microphone.stop();
      microphone.stream.getTracks().forEach((track) => track.stop());
    }
  }, [microphone, userMedia]);

  useEffect(() => {
    const getDeepgramKey = async () => {
      const object = await fetchDeepGramKey();
      if (inDevelopment) {
        console.log("dgkey");
      }
      setApiKey(object);
    };
    if (!apiKey && userType !== "Standard") {
      if (inDevelopment) {
        console.log("fetching deepgram key");
      }
      getDeepgramKey();
    }
  }, [apiKey, userType, mode]);

  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      if (inDevelopment) {
        console.log("connecting to deepgram");
      }
      const deepgram = createClient(apiKey?.key ?? "");
      const connection = deepgram.listen.live({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        if (inDevelopment) {
          console.log("connection established");
        }
        setListening(true);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        if (inDevelopment) {
          console.log("connection closed");
        }
        setListening(false);
        setApiKey(null);
        setConnection(null);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        if (inDevelopment) {
          console.log("look at the data", data);
        }
        const words = data.channel.alternatives[0].words;
        const caption = words
          .map((word) => word.punctuated_word ?? word.word)
          .join(" ");
        if (data.is_final) {
          setFullTranscript((prev) => prev.trim() + " " + caption);
          setCaption("");
        } else {
          if (caption !== "") {
            setCaption(caption);
          }
        }
      });

      setConnection(connection);
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        if (isListening) {
          const blob = first;
          connection?.send(blob);
          remove();
        }

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [connection, queue, remove, first, size, isProcessing, isListening]);

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
      if (inDevelopment) {
        console.log("WebSocket connection established.");
      }
    },

    onMessage: (event) => {
      handleOnMessage(
        event,
        noteData,
        setNotes,
        noteID,
        resetTranscript,
        navigate,
        userType,
        setFullTranscript
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
    if (inDevelopment) {
      console.log("listening effect triggered");
      console.log("mode", mode);
    }
    if (!listening && mode === "note" && userType === "Standard") {
      setTimeout(() => {
        if (mode === "note") {
          SpeechRecognition.startListening({ continuous: true });
          if (inDevelopment) {
            console.log("Restart after trgger");
          }
        } else {
          return;
        }
      }, 100);
    }
  }, [listening]);

  useEffect(() => {
    if (inDevelopment) {
      console.log("mode effect triggered");
      console.log("mode", mode);
    }
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

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    //first is stop any recording
    if (mode !== "note") {
      const title = titleFromID(noteID, noteData);

      let transcriptMessage;
      stopRecordingMedia(recorder);
      if (userType === "Standard") {
        setTimeout(() => {
          SpeechRecognition.stopListening();
        }, 500);
        transcriptMessage = fullTranscript;
      } else {
        stopDGMicrophone();
        transcriptMessage = fullTranscript + " " + caption;
      }
    } else {
      if (userType === "Standard") {
        //google
        if (inDevelopment) {
          console.log("start recording with api......", noteID);
        }
        SpeechRecognition.startListening({ continuous: true });
      } else {
        //deepgram
        startDGMicrophone();
      }
      startRecordingMedia(session, setRecorder, noteID);
    }

    setTimeout(() => {
      fetchNoteRecords(session, true).then((data) => {
        setNotes(data);
      });
    }, 1000);
  }, [mode]);

  //core logic for note mode
  useEffect(() => {
    const sendMessage = () => {
      if (fullTranscript || caption) {
        const title = titleFromID(noteID, noteData);
        const transcriptMessage =
          userType === "Standard"
            ? fullTranscript
            : fullTranscript + " " + caption;
        if (inDevelopment) {
          console.log("sending to back", transcriptMessage);
        }
        sendJsonMessage({
          title,
          transcript: transcriptMessage,
          init: false,
          note_id: noteID,
          token: session.access_token,
        });
      }
    };

    if (mode === "note") {
      const timeCheck = userType === "Standard" ? 3250 : 2000;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (fullTranscript.length >= frequency * 1.7) {
        if (inDevelopment) {
          console.log("overflow sending");
        }
        sendMessage();
        if (userType === "Standard") {
          resetTranscript();
        } else {
          setFullTranscript("");
        }
      }

      //send to backend after 2 sec
      const backID = setTimeout(() => {
        if (mode === "note") {
          if (inDevelopment) {
            console.log("reset and sending to back");
          }
          if (userType === "Standard") {
            SpeechRecognition.startListening({ continuous: true });
          }
          sendMessage();
        } else {
          SpeechRecognition.stopListening();
        }
      }, timeCheck);
      setTimeoutId(backID);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
        SpeechRecognition.stopListening();
      }
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fullTranscript, caption]);

  useEffect(() => {
    if (userType === "Standard") {
      setFullTranscript(transcript);
    }
  }, [transcript]);

  //ping pong to keep WS connection alive
  useEffect(() => {
    //fetchTaskRecords().then(setDocs);
    const ping = setInterval(() => {
      sendJsonMessage({ ping: true });
    }, 30000);

    //if deactivate any active notes
    deactivateNotes(session).then((data) => {
      setNotes(data);
    });

    return () => {
      clearInterval(ping);
    };
  }, []);

  const controlProps = {
    wsJSON: sendJsonMessage,
    SpeechRecognition,
  };

  useEffect(() => {
    setTimeout(() => {
      if (userType !== "Premium" && !compatible) {
        if (inDevelopment) {
          console.log(userType);
        }
        toast("Live trasncript not supported on this browser", {
          description: "Upgrade Plan or swich to Chrome/Safari",
          action: {
            label: "X",
            onClick: () => console.log("Undo"),
          },
        });
      }
    }, 400);
  }, [compatible]);

  return (
    <div className="flex flex-col h-screen">
      <NewNoteProvider>
        <ToastProvider>
          <NoteDataContext.Provider
            value={{ noteData, setNotes, noteID, setNoteID, mode, setMode }}
          >
            <TranscriptContext.Provider value={{ fullTranscript, caption }}>
              <AppRoutes controlProps={controlProps} />
            </TranscriptContext.Provider>
          </NoteDataContext.Provider>
        </ToastProvider>
      </NewNoteProvider>
    </div>
  );
}

export default TransverseApp;
