import "regenerator-runtime";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import Home from "./content/panel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatroom from "./content/docView";
import Noteroom from "./content/noteView";
import HelpModal from "./help";
import { fetchTaskRecords, fetchNoteRecords } from "./services/docsApi";
import { AppRoutes } from "./content/routes";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const WS_URL = "ws://localhost:5001/notes-api";

function App() {
  //this is for help
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  //this is for note vs default mode
  const [mode, setMode] = useState("default");

  //this is for docs in sidebar
  const [docData, setData] = useState([]);

  //this is for notes in sidebar
  const [noteData, setNotes] = useState([]);

  //this is for specific active instace of WS notes
  const [noteName, setNoteName] = useState();

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
        fetch(`/tverse-api`, {
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
            return response.json();
          })
          .then((content) => {
            let initRecord = JSON.parse(content);
            console.log(initRecord);
            setData([...docData, initRecord]);
            const ID = initRecord.task_id;
            console.log(ID);
            return ID;
          })
          .then((ID) => {
            const eventSource = new EventSource(`/awaitDoc-api/?ID=${ID}`);
            eventSource.onopen = () => console.log(">>> Connection opened!");
            eventSource.onmessage = () => {
              //Grabbing everything
              try {
                fetchTaskRecords().then(setData);
              } catch {
                console.error("Error parsing SSE data:", error);
              }
            };
            eventSource.onerror = (error) => {
              console.error("SSE error:", error);
              eventSource.close();
            };
          })
          .catch((err) => {
            console.log(err);
          });
        resetTranscript();
      },
    },
    {
      command: "go to *",
      callback: (route) => {
        fetch(`/route-api`, {
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
          });
      },
    },
    {
      command: "* note mode",
      callback: (name) => {
        resetTranscript();
        console.log(name);
        const noteMatch = noteData.filter((record) => {
          return record.title === name;
        });
        if (noteMatch.length === 0) {
          const statusUpdate = noteData.map((record) => {
            return { ...record, status: "inactive" };
          });
          setNotes(statusUpdate);
          //this should now create a record in the backend if it doens't exsist
          //sendJsonMessage({ title: name, transcript: "" });

          //TDODODODODO JSON to backend that includes title and ts
        }
        setMode("note");
        sendJsonMessage({
          title: name,
          transcript: transcript,
          init: true,
        });

        setNoteName(name);

        console.log();
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
        setShowModal(true);
      },
    },
    {
      command: "exit",
      callback: () => {
        resetTranscript();
        setShowModal(false);
      },
    },
    {
      command: "* note insturctions",
      callback: (instructions) => {
        resetTranscript();
        fetch("/settings/noteInstruct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instructions }),
        });
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

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

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      console.log("this very bad how did you end up here");
    }
  }, []);

  useEffect(() => {
    fetchTaskRecords().then(setData);
    fetchNoteRecords().then(setNotes);
  }, []);

  return (
    <Router>
      <div className="container-fluid vh-100 d-flex">
        <div className="row flex-grow-1">
          <div
            className="col-3 bg-lightgrey p-0 d-flex flex-column"
            style={{ minWidth: "200px", maxWidth: "250px" }}
          >
            <Sidebar docData={docData} noteData={noteData} />
          </div>

          <div className="col">
            <AppRoutes
              transcript={transcript}
              docData={docData}
              noteData={noteData}
            />
          </div>
          <div>
            <HelpModal show={showModal} onClose={closeModal}>
              {/* Modal body content goes here */}
              ...
            </HelpModal>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
