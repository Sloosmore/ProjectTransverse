import { Routes, Route } from "react-router-dom";
import Noteroom from "./notes/noteView";
import Home from "./panel";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import AppNav from "./top/appNav";
import NovelEditor from "./novel/editor/editor";
import NoteComponent from "./novel/editorWrapper";
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
  <div className="flex flex-col h-screen">
    <AppNav
      profileKit={profileKit}
      controlProps={controlProps}
      noteData={noteData}
    />
    <Routes>
      <Route
        path="/classic/:noteId"
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
        path="/:noteId"
        element={
          <NoteComponent
            noteData={noteData}
            transcript={transcript}
            modeKit={modeKit}
            annotatingKit={annotatingKit}
            pauseProps={pauseProps}
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
