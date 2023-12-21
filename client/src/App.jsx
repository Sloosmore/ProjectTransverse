import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import Home from "./panel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatroom from "./chat-room";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
  //this is for sidebar
  const [data, setData] = useState([]);

  const [tscript, updateTranscript] = useState("Just start talking");

  function sendToServer(blob) {
    fetch(`/v-api`, {
      method: "POST",
      body: blob,
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((text) => {
        console.log("Response from server:", text);
        let audioRes = JSON.parse(text);
        updateTranscript(audioRes["transcript"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function record_and_send(stream) {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = (e) =>
      sendToServer(new Blob(chunks, { type: "audio/webm;codecs=opus" }));
    setTimeout(() => recorder.stop(), 5000);
    recorder.start();
  }

  useEffect(() => {
    // This code will run after `tscript` is updated
    console.log(tscript);
  }, [tscript]);

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      // Chunks is genrally a list (const chunks = []) but I am making it a let because I want to overwrite it every time

      const onSuccess = (stream) => {
        setInterval(() => record_and_send(stream), 5000);
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(onSuccess)
        .catch((error) => console.log("Error getting media", error));
    }
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
              <Route path="/" element={<Home transcript={tscript} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
