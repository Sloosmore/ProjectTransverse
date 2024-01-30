import { Routes, Route } from "react-router-dom";
import Chatroom from "./docView";
import Noteroom from "./noteView";
import Home from "./panel";
import Files from "./files";

export const AppRoutes = ({
  transcript,
  docData,
  noteData,
  helpModal,
  modeKit,
  annotatingKit,
}) => (
  <Routes>
    <Route
      path="/n/:noteId"
      element={
        <Noteroom
          noteData={noteData}
          transcript={transcript}
          modeKit={modeKit}
          annotatingKit={annotatingKit}
        />
      }
    />
    <Route
      path="/c/:taskId"
      element={<Chatroom docData={docData} transcript={transcript} />}
    />
    <Route
      path="/"
      element={
        <Home
          transcript={transcript ? transcript.slice(-300) : ""}
          helpModal={helpModal}
        />
      }
    />
    <Route path="/files" element={<Files />} />
  </Routes>
);
