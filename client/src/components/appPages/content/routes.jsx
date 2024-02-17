import { Routes, Route } from "react-router-dom";
import Noteroom from "./notes/noteView";
import Home from "./panel";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
export const AppRoutes = ({
  transcript,
  docData,
  noteData,
  helpModalKit,
  modeKit,
  annotatingKit,
  canvasEdit,
  controlProps,
}) => (
  <div className="h-full relative overflow-hidden">
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
    <BottomConent
      helpModalKit={helpModalKit}
      controlProps={controlProps}
      noteData={noteData}
    />
  </div>
);
