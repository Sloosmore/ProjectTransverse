import "regenerator-runtime";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import "./tvApp.css";
import Sidebar from "./sidebar/sidebar";
import { AppRoutes } from "./content/routes";
import "bootstrap-icons/font/bootstrap-icons.css";
import { handleSendLLM } from "./services/setNotepref";
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
import { useDebounce } from "use-debounce";

const WS_URL = `${import.meta.env.VITE_WS_SERVER_URL}/notes-api`;

function TransverseApp() {
  const navigate = useNavigate();

  const { session } = useAuth();
  //this is for help
  const [showHelpModal, setShowHelpModal] = useState(false);
  const closeModal = () => setShowHelpModal(false);

  //this is for note vs default mode
  const [mode, setMode] = useState("default");

  //this is for docs in sidebar
  const [docData, setDocs] = useState([]);

  //this is for notes in sidebar
  const [noteData, setNotes] = useState([]);

  //this is for specific active instace of WS notes
  //ID of note and not title use titleFromID to get title
  const [noteID, setNoteID] = useState(localStorage.getItem("noteID") || "");

  //hide the sidebar while editing notes
  const [annotating, setAnnotating] = useState(false);

  //for editing notes in files link
  const [showOffCanvasEdit, setOffCanvasEdit] = useState(false);

  //for new note toast
  const [activeToast, setActiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  //this is for note field
  const [newNoteField, setNewNoteField] = useState(false);

  useEffect(() => {
    localStorage.setItem("noteID", noteID);
  }, [noteID]);

  const commands = [
    {
      command: "kill",
      callback: () => {
        window.location.replace("https://www.google.com");
      },
    },
    {
      command: "transverse",
      callback: () => {
        //tvrseFunc(transcript, setDocs);
        //resetTranscript();
      },
    },
    {
      command: "go to *",
      callback: (route) => {
        /*fetch(`/route-api`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ route }),
        })
          .then((response) => {
            if (!response.ok) {
              throw Error(
                `Server returned ${response.status}: ${response.statusText}`
              );
            }
            const { resetTranscript } = useSpeechRecognition();
            const route = response.body["task_id"];
          })
          .catch((err) => {
            console.log(err);
          });*/
      },
    },
    {
      command: "* note mode",
      callback: (name) => {
        resetTranscript();
        createNewNote(
          name,
          transcript,
          noteData,
          setNotes,
          setMode,
          wsJSON,
          session
        );
      },
    },
    {
      command: "default mode",
      callback: () => {
        resetTranscript();
        const deactiveNotes = noteData.map((record) => {
          return { ...record, status: "inactive" };
        });
        setNotes(deactiveNotes);
        setMode("default");
      },
    },
    {
      command: "clear",
      callback: () => resetTranscript(),
    },
    {
      command: "help",
      callback: () => {
        resetTranscript();
        setShowHelpModal(true);
      },
    },
    {
      command: "exit",
      callback: () => {
        resetTranscript();
        setShowHelpModal(false);
      },
    },
    {
      command: "* note insturctions",
      callback: (instructions) => {
        resetTranscript();
        handleSendLLM(instructions);
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

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
        navigate
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
    if (!listening && mode === "note") {
      setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true });
        console.log("Restart after trgger");
      }, 100);
    }
  }, [listening]);

  /*
  const [failsafeTimeoutId, setFailsafeTimeoutId] = useState(null);

  useEffect(() => {
    if (mode === "note") {
      if (failsafeTimeoutId) {
        clearTimeout(failsafeTimeoutId);
      }

      // Set a new timeout
      const id = setTimeout(() => {
        setTimeout(() => {
          SpeechRecognition.startListening({ continuous: true });
          console.log("mic restared");
        }, 200);
      }, 7000); // 10 seconds

      setFailsafeTimeoutId(id);

      // Clean up function
      return () => {
        clearTimeout(id); // Using 'id' directly
      };
    }
  }, [transcript]);
  */

  // ------------------------------------------------------------------------------------------------

  if (!browserSupportsSpeechRecognition) {
    console.log("Browser doesnt support speech recognition.");
    return <NoAudioSupport />;
  }

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (mode === "default") {
      setTimeout(() => {
        SpeechRecognition.stopListening();
        console.log("Listening stopped");
      }, 5000);
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
      }, 3250);
      setTimeoutId(backID);
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
    setDocs,
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
  };

  const modeKit = {
    mode,
    setMode,
    noteData,
    setNotes,
  };

  const annotatingKit = {
    annotating,
    setAnnotating,
  };

  const helpModalKit = {
    showHelpModal,
    setShowHelpModal,
    closeModal,
  };

  const profileKit = {
    SpeechRecognition,
  };

  const newNoteButtonkit = {
    setNewNoteField,
    newNoteField,
    noteID,
  };

  return (
    <div className="flex flex-col h-screen">
      <AppRoutes
        transcript={transcript}
        docData={docData}
        noteData={noteData}
        helpModalKit={helpModalKit}
        helpModal={setShowHelpModal}
        modeKit={modeKit}
        annotatingKit={annotatingKit}
        canvasEdit={canvasEdit}
        controlProps={controlProps}
        newNoteButtonkit={newNoteButtonkit}
        profileKit={profileKit}
        pauseProps={pauseProps}
      />
      <SupportedToast />
      <SubmitToast {...submitToastKit} />
    </div>
  );
}

export default TransverseApp;
//move helpModal into panel
/*        {!annotating && (
          <div
            className="col-3 bg-lightgrey p-0 d-flex flex-column h-full"
            style={{ minWidth: "200px", maxWidth: "250px" }}
          >
            <Sidebar
              docData={docData}
              noteData={noteData}
              pauseProps={pauseProps}
              controlProps={controlProps}
              profileKit={profileKit}
            />
          </div>
        )}
 */
