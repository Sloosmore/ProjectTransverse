import { Routes, Route } from "react-router-dom";
import Noteroom from "./notes/noteView";
import Home from "./panel";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import AppNav from "./top/appNav";
import Novel from "./novel/editor";
//import Editor from "./tiptapNotes/editor";
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
      <Route path="/edit" element={<Novel />} />
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
/* 

      <Route
        path="/oldIndex"
        element={
          <Home
            transcript={transcript ? transcript.slice(-300) : ""}
            helpModalKit={helpModalKit}
          />
        }
      />*/
