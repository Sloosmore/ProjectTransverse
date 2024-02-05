import { Routes, Route } from "react-router-dom";
import Chatroom from "./docs/docView";
import Noteroom from "./notes/noteView";
import Home from "./panel";
import Files from "./files/files";

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
      path="/:noteId"
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
