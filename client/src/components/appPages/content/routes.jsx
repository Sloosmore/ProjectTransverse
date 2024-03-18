import { Routes, Route } from "react-router-dom";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import AppNav from "./top/appNav";
import NoteComponent from "./novel/editorWrapper";
import FolderView from "./files/folderView/folderView";
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
        path="n/:noteId"
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
        path="f/:folderId"
        element={
          <FolderView
            canvasEdit={canvasEdit}
            newNoteButtonkit={newNoteButtonkit}
          />
        }
      />
      <Route
        path="/*"
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
