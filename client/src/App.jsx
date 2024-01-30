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
import { handleOnMessage } from "./services/wsResponce";

import titleFromID from "./services/titleFromID";

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
  //ID of note and not title use titleFromID to get title
  const [noteID, setNoteID] = useState(localStorage.getItem("noteName") || "");

  //hide the sidebar while editing notes
  const [annotating, setAnnotating] = useState(false);

  useEffect(() => {
    localStorage.setItem("noteName", noteID);
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
        createNewNote(name, transcript, noteData, setNotes, setMode, wsJSON);
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
        resetTranscript
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
    if (!listening) {
      setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true });
        console.log("Restart after trgger");
      }, 100);
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
      //send to backend after 2 sec
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const backID = setTimeout(() => {
        const title = titleFromID(noteID, noteData);

        sendJsonMessage({
          title,
          transcript: transcript,
          init: false,
          note_id: noteID,
        });
        SpeechRecognition.startListening({ continuous: true });
        console.log("sent to backend");
      }, 2500);
      setTimeoutId(backID);

      //restart frontend after 7
      clearTimeout(failsafeTimeoutId);

      // Set a new timeout
      /*
      const resetID = setTimeout(() => {
        setTimeout(() => {
          SpeechRecognition.startListening({ continuous: true });
          console.log("mic restared");
        }, 200);
      }, 7000); // 10 seconds
    

      setFailsafeTimeoutId(resetID);

      // Clean up function
      return () => {
        clearTimeout(resetID);
        clearTimeout(backID); // Using 'id' directly
      };
        */
    }
  }, [transcript]);

  const handleCKeyDown = (event) => {
    if (event.key === "c") {
      resetTranscript();
    }
  };

  useEffect(() => {
    //fetchTaskRecords().then(setDocs);
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

  useEffect(() => {
    console.log(noteData);
  }, [noteData]);

  const controlProps = {
    setDocs,
    setNotes,
    wsJSON: sendJsonMessage,
    setMode,
  };

  const pauseProps = {
    mode,
    setMode,
    noteName: noteID,
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

  const annotatingKit = {
    annotating,
    setAnnotating,
  };

  return (
    <Router>
      <div className="container-fluid vh-100 d-flex">
        <div className="row flex-grow-1">
          {!annotating && (
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
          )}

          <div className="col">
            <AppRoutes
              transcript={transcript}
              docData={docData}
              noteData={noteData}
              helpModal={setShowHelpModal}
              modeKit={modeKit}
              annotatingKit={annotatingKit}
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
