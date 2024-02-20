import { Routes, Route } from "react-router-dom";
import Noteroom from "./notes/noteView";
import Home from "./panel";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import TopProfile from "./top/profile";
import AppNav from "./top/appNav";
export const AppRoutes = ({
  transcript,
  docData,
  noteData,
  helpModalKit,
  modeKit,
  annotatingKit,
  canvasEdit,
  controlProps,
  newNoteButtonkit,
  profileKit,
  pauseProps,
}) => (
  <div className="h-full relative overflow-hidden">
    <AppNav
      profileKit={profileKit}
      controlProps={controlProps}
      noteData={noteData}
    />
    <Routes>
      <Route
        path="/:noteId"
        element={
          <Noteroom
            noteData={noteData}
            transcript={transcript}
            modeKit={modeKit}
            annotatingKit={annotatingKit}
            pauseProps={pauseProps}
          />
        }
      />
      <Route
        path="/oldIndex"
        element={
          <Home
            transcript={transcript ? transcript.slice(-300) : ""}
            helpModalKit={helpModalKit}
          />
        }
      />
      <Route
        path="/"
        element={
          <Files canvasEdit={canvasEdit} newNoteButtonkit={newNoteButtonkit} />
        }
      />
    </Routes>
    <BottomConent
      helpModalKit={helpModalKit}
      controlProps={controlProps}
      noteData={noteData}
    />
  </div>
);
