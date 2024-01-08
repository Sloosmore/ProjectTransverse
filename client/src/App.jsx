import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import Home from "./panel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatroom from "./chat-room";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function App() {
  //this is for sidebar
  const [mode, setMode] = useState("default");

  const [data, setData] = useState([]);

  const commands = [
    {
      command: "kill",
      callback: () => {
        window.location.replace("https://www.google.com");
      },
    },
    {
      command: "transverse",
      callback: ({ resetTranscript }) => {
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
            setData([...data, initRecord]);
            const ID = initRecord.task_id;
            console.log(ID);
            return ID;
          })
          .then((ID) => {
            const eventSource = new EventSource(`/awaitDoc-api/?ID=${ID}`);
            eventSource.onopen = () => console.log(">>> Connection opened!");
            eventSource.onmessage = (event) => {
              const inData = event.data;
              console.log("SSE message:", inData);
              //probably check again
              try {
                const newData = JSON.parse(inData);

                setData(...data, newData); // Update the state with the modified array
                console.log(data);
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
      command: "note(s) mode",
      callback: () => {
        setMode("note");
      },
    },
    {
      command: "default mode",
      callback: () => {
        setMode("default");
      },
    },
    {
      command: "clear",
      callback: ({ resetTranscript }) => resetTranscript(),
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

  useEffect(() => {
    let apiRoute;
    if (mode === "default") {
      apiRoute = `/tscript-api`;
    } else if (mode === "note") {
      apiRoute = `/notes-api`;
    }
    fetch(apiRoute, {
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
  }, [transcript]);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      console.log("this very bad how did you end up here");
    }
  }, [mode]);

  useEffect(() => {
    fetch("/records-api", {
      method: "GET",
    })
      .then((responce) => responce.json())
      .then((data) => {
        setData(data.records);
      });
  }, []);

  return (
    <Router>
      <div className="container-fluid vh-100 d-flex">
        <div className="row flex-grow-1">
          <div
            className="col-3 bg-lightgrey p-0 d-flex flex-column"
            style={{ minWidth: "200px", maxWidth: "250px" }}
          >
            <Sidebar data={data} />
          </div>

          <div className="col">
            <Routes>
              <Route path="/c/:taskId" element={<Chatroom />} />
              <Route path="/" element={<Home transcript={transcript} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
