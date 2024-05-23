import "regenerator-runtime";
import { useState, useEffect, useCallback } from "react";
import "./tvApp.css";
import { AppRoutes } from "./content/routes";
import "bootstrap-icons/font/bootstrap-icons.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { handleOnMessage } from "./services/noteWebsockets/wsResponce";
import { fetchNoteRecords } from "@/api/crud/notes/readNotes";
import titleFromID from "./services/frontendNoteConfig/titleFromID";
import { useAuth } from "../../hooks/userHooks/auth";
import { useNavigate } from "react-router-dom";
import { stopRecordingMedia } from "./services/audio/mediaRecorder";
import { TranscriptContext } from "@/hooks/noteHooks/transcriptStore";
import { NoteDataContext } from "@/hooks/noteHooks/noteDataStore";
import { onPause } from "./services/pausePlay";
import { startRecordingMedia } from "./services/audio/mediaRecorder";
import { ToastProvider } from "@/hooks/toast";
import { NewNoteProvider } from "@/hooks/noteHooks/newNote";
import { useQueue } from "@uidotdev/usehooks";
import { fetchDeepGramKey, isKeyExpired } from "./services/audio/deepgram";
import { LiveTranscriptionEvents, createClient } from "@deepgram/sdk";
import { toast } from "sonner";
import { useBrowser } from "@/hooks/browserSupport";
import { useUserPref } from "@/hooks/userHooks/userPreff";
import { formatIncommingTranscript } from "./services/transcriptFormating/transcriptConfig";
import { useCustomWebSocket } from "@/hooks/websocket/customWebsocket";
import { breakTranscript } from "@/api/crud/notes/updateTranscriptBreak";
import { StandardFormating } from "./services/noteWebsockets/transcriptFormat";
import { resetSaveTranscript } from "./services/noteWebsockets/transcriptReset";
import { useRef } from "react";
import { getAudioStream } from "./services/audio/startMic";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

function TransverseApp() {
  const { compatible } = useBrowser();
  const navigate = useNavigate();
  const { session, userType, audioOn } = useAuth();
  const { frequency } = useUserPref();
  //this is for note vs default mode
  const [mode, setMode] = useState("default");
  //this is for notes in sidebar
  const [noteData, setNotes] = useState([]);
  //this is for specific active instace of WS notes
  //ID of note and not title use titleFromID to get title
  const [noteID, setNoteID] = useState(localStorage.getItem("noteID") || null);
  const [caption, setCaption] = useState([]);

  const noteIDRef = useRef(noteID);
  const notesRef = useRef(noteData);
  const captionRef = useRef(caption);

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
  const [fullTranscript, setFullTranscript] = useState([]);
  const fullTsRef = useRef(fullTranscript);

  useEffect(() => {
    noteIDRef.current = noteID;
    notesRef.current = noteData;
  }, [noteID, noteData]);

  useEffect(() => {
    captionRef.current = caption;
  }, [caption]);

  useEffect(() => {
    fullTsRef.current = fullTranscript;
  }, [fullTranscript]);

  const startDGMicrophone = useCallback(async () => {
    // Set up mediaRecorder and getUserMedia
    console.log("starting deep microphone");
    try {
      const userMedia = await getAudioStream();
      const microphone = new MediaRecorder(userMedia);
      microphone.start(500);
      microphone.ondataavailable = (e) => {
        add(e.data);
      };
      setUserMedia(userMedia);
      setMicrophone(microphone);
    } catch (error) {
      console.error("Error capturing audio:", error);
    }
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
        //console.log("dgkey");
      }
      setApiKey(object);
    };

    const handleVisibilityChange = () => {
      //console.log("visibility key", apiKey);

      if (
        document.visibilityState === "visible" &&
        ((apiKey && isKeyExpired(apiKey)) || !apiKey)
      ) {
        if (mode === "default") {
          getDeepgramKey();
        }
      }
    };

    if (!apiKey && userType !== "Standard") {
      if (inDevelopment) {
        //console.log("fetching deepgram key");
      }
      getDeepgramKey();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [apiKey, userType, mode]);

  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      if (inDevelopment) {
        //console.log("connecting to deepgram");
      }
      const deepgram = createClient(apiKey?.key ?? "");
      const connection = deepgram.listen.live({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        diarize: true,
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
        const words = data.channel.alternatives[0].words;
        console.log(data);

        const in_caption = formatIncommingTranscript(
          notesRef.current,
          noteIDRef.current,
          fullTsRef.current,
          words,
          captionRef.current
        );

        if (
          data.is_final &&
          Array.isArray(in_caption) &&
          in_caption.length > 0
        ) {
          //I should also write to the DB at this point
          setFullTranscript((prev) => [...prev, ...in_caption]);
          setCaption([]);
        } else {
          //this is broken because caption is not being set
          if (Array.isArray(in_caption) && in_caption.length > 0) {
            setCaption((prev) => {
              if (Array.isArray(prev) && prev.length > 0) {
                return [...prev.slice(0, prev.length - 1), ...in_caption];
              } else {
                return in_caption;
              }
            });
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

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const { sendJsonMessage, readyState } = useCustomWebSocket(
    noteData,
    setNotes,
    noteID,
    navigate
  );

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

      if (userType === "Premuim")
        breakTranscript(noteID, [...fullTranscript, ...caption]);
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
      let transcriptMessage;
      stopRecordingMedia(recorder);

      resetSaveTranscript(
        fullTranscript,
        userType,
        resetTranscript,
        setFullTranscript,
        setNotes,
        noteID
      );
      if (userType === "Standard") {
        setTimeout(() => {
          SpeechRecognition.stopListening();
        }, 500);
        transcriptMessage = fullTranscript;
      } else {
        stopDGMicrophone();
      }
    } else {
      if (userType === "Standard") {
        //google
        if (inDevelopment) {
          console.log("start recording with api......", noteID);
        }
        //so it won't mess with anything as premium will need an array of objects
        setFullTranscript("");
        SpeechRecognition.startListening({ continuous: true });
      } else {
        //deepgram
        console.log("start recording with deepgram......", apiKey);
        startDGMicrophone(apiKey);
      }
      audioOn && startRecordingMedia(session, setRecorder, noteID);
    }

    const deactivate = mode === "note" ? false : true;

    fetchNoteRecords(session, deactivate).then((data) => {
      setNotes(data);
    });
  }, [mode]);

  //core logic for note mode
  useEffect(() => {
    const sendMessage = () => {
      if (fullTranscript || caption) {
        const title = titleFromID(noteID, noteData);
        let transcriptMessage =
          userType === "Standard"
            ? fullTranscript
            : // This needed to change because they are a list
              [...fullTranscript, ...caption];

        let threshold = false;
        if (userType === "Standard") {
          threshold = transcriptMessage.length >= frequency;
          //needs to format transcript
          StandardFormating(noteID, setFullTranscript);
        } else {
          threshold =
            transcriptMessage.map((obj) => obj.caption).join(" ").length >=
            frequency;
        }

        if (threshold) {
          /*
          1. reset transcript 
          2. save transcript in DB & notedata
          */

          resetSaveTranscript(
            transcriptMessage,
            userType,
            resetTranscript,
            setFullTranscript,
            setNotes,
            noteID
          );

          if (inDevelopment) console.log("sending to back", transcriptMessage);

          /*
          3. Send to backend
          */

          sendJsonMessage({
            title,
            transcript: transcriptMessage,
            note_id: noteID,
            token: session.access_token,
          });
        }
        //write transcript here
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
        } else {
          SpeechRecognition.stopListening();
        }
        if (inDevelopment) console.log("failsafe");
        sendMessage();
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

    return () => {
      clearInterval(ping);
    };
  }, []);

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
    }, 600);
  }, [compatible]);

  return (
    <div className="flex flex-col h-dvh lg:h-screen">
      <NewNoteProvider>
        <ToastProvider>
          <NoteDataContext.Provider
            value={{ noteData, setNotes, noteID, setNoteID, mode, setMode }}
          >
            <TranscriptContext.Provider
              value={{ fullTranscript, caption, setFullTranscript, setCaption }}
            >
              <AppRoutes />
            </TranscriptContext.Provider>
          </NoteDataContext.Provider>
        </ToastProvider>
      </NewNoteProvider>
    </div>
  );
}

export default TransverseApp;
