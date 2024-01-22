import "regenerator-runtime";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HelpModal from "./modals/help";
import { fetchTaskRecords, fetchNoteRecords } from "./services/sidebarTasksApi";
import { AppRoutes } from "./content/routes";
import "bootstrap-icons/font/bootstrap-icons.css";
import { tvrseFunc } from "./services/tverseAPI";
import { handleSendLLM } from "./services/setNotepref";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const WS_URL = "ws://localhost:5001/notes-api";

function App() {
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
  const [noteName, setNoteName] = useState(
    localStorage.getItem("noteName") || ""
  );

  useEffect(() => {}, [noteData]);

  useEffect(() => {
    localStorage.setItem("noteName", noteName);
  }, [noteName]);

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },

    onMessage: (event) => {
      const wsData = JSON.parse(event.data);
      console.log("WebSocket message received:", wsData);
      if (wsData.noteRecord) {
        //this should happen once during notemode init
        console.log("-------======================================-------");
        console.log(wsData.noteRecord);
        setNotes([...noteData, wsData.noteRecord]);
      }
      if (wsData.resetState === true) {
        resetTranscript();
      }
      if (wsData.md) {
        //find record and set markdown in that specific file
        //this will update the markdown of a specific record
        const updateMd = noteData.map((record) => {
          if (record.title === noteName) {
            record.markdown = wsData.md;
          }
          return record;
        });
        setNotes(updateMd);
      }
    },

    onError: (event) => {
      console.error("WebSocket error observed:", event);
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

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
        tvrseFunc(transcript, setDocs);
        resetTranscript();
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
          setNoteName
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

  // Mic Failsafe functions -----------------------------------------------------------------------------
  //so timerFailsame does not call UseEffect
  const [timerFailsafe, setTimerFailsafe] = useState(true);

  useEffect(() => {
    if (!listening && timerFailsafe) {
      SpeechRecognition.stopListening();
      SpeechRecognition.startListening({ continuous: true });
      console.log("Mic restared");
    }
  }, [listening]);

  const [failsafeTimeoutId, setFailsafeTimeoutId] = useState(null);

  useEffect(() => {
    if (mode === "note") {
      if (failsafeTimeoutId) {
        clearTimeout(failsafeTimeoutId);
      }

      // Set a new timeout
      const id = setTimeout(() => {
        setTimerFailsafe(false);
        SpeechRecognition.stopListening();
        setTimeout(() => {
          console.log("mic off!!!");
          SpeechRecognition.startListening({ continuous: true });
          setTimerFailsafe(true);
        }, 400); // turn on the mic after .077 seconds
      }, 10000); // 25 seconds

      setFailsafeTimeoutId(id);

      // Clean up function
      return () => {
        clearTimeout(id); // Using 'id' directly
      };
    }
  }, [transcript]);
  // ------------------------------------------------------------------------------------------------

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (mode === "default") {
      fetch(`/tscript-api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(
              `Server returned ${response.status}: ${response.statusText}`
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (mode === "note") {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout
      const id = setTimeout(() => {
        sendJsonMessage({
          title: noteName,
          transcript: transcript,
          init: false,
        });
      }, 2000); // 400 milliseconds
      setTimeoutId(id);

      // Clean up function
      return () => {
        clearTimeout(id); // Using 'id' directly
      };
    }
  }, [transcript]);

  const handleCKeyDown = (event) => {
    if (event.key === "c") {
      resetTranscript();
    }
  };

  useEffect(() => {
    fetchTaskRecords().then(setDocs);
    fetchNoteRecords().then(setNotes);
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      console.log("this very bad how did you end up here");
    }

    window.addEventListener("keydown", handleCKeyDown);
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleCKeyDown);
    };
  }, []);

  const controlProps = {
    setDocs,
    setNotes,
    wsJSON: sendJsonMessage,
    setMode,
    setNoteName,
  };

  const pauseProps = {
    mode,
    setMode,
    noteName,
    setNotes,
    noteData,
  };

  const eventListeners = {
    handleCKeyDown,
  };

  const modeKit = {
    mode,
    setMode,
    noteData,
    setNotes,
  };

  return (
    <Router>
      <div className="container-fluid vh-100 d-flex">
        <div className="row flex-grow-1">
          <div
            className="col-3 bg-lightgrey p-0 d-flex flex-column"
            style={{ minWidth: "200px", maxWidth: "250px" }}
          >
            <Sidebar
              docData={docData}
              noteData={noteData}
              pauseProps={pauseProps}
              controlProps={controlProps}
              eventListeners={eventListeners}
            />
          </div>

          <div className="col">
            <AppRoutes
              transcript={transcript}
              docData={docData}
              noteData={noteData}
              helpModal={setShowHelpModal}
              modeKit={modeKit}
            />
          </div>
          <div>
            <HelpModal show={showHelpModal} onClose={closeModal} />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
