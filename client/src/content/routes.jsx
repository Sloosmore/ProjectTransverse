import { Routes, Route } from "react-router-dom";
import Chatroom from "./docView";
import Noteroom from "./noteView";
import Home from "./panel";

export const AppRoutes = ({ transcript, docData, noteData }) => (
  <Routes>
    <Route
      path="/n/:taskId"
      element={<Noteroom noteData={noteData} transcript={transcript} />}
    />
    <Route
      path="/c/:taskId"
      element={<Chatroom docData={docData} transcript={transcript} />}
    />
    <Route
      path="/"
      element={<Home transcript={transcript ? transcript.slice(-300) : ""} />}
    />
  </Routes>
);
