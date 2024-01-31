import { Routes, Route } from "react-router-dom";
import Chatroom from "./docView";
import Noteroom from "./noteView";
import Home from "./panel";
import Files from "./files";

export const AppRoutes = ({
  transcript,
  docData,
  noteData,
  helpModalKit,
  modeKit,
  annotatingKit,
  canvasEdit,
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
          helpModalKit={helpModalKit}
        />
      }
    />
    <Route path="/files" element={<Files canvasEdit={canvasEdit} />} />
  </Routes>
);
