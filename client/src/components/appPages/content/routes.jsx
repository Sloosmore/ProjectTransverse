import { Routes, Route } from "react-router-dom";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import AppNav from "./top/appNav";
import NoteComponent from "./novel/editorWrapper";
import FolderView from "./files/folderView/folderView";
//import Editor from "./tiptapNotes/editor";
export const AppRoutes = ({
  noteData,
  modeKit,
  canvasEdit,
  controlProps,
  newNoteButtonkit,
  pauseProps,
}) => (
  <div className="flex flex-col h-screen">
    <AppNav controlProps={controlProps} noteData={noteData} />
    <Routes>
      <Route
        path="n/:noteId"
        element={
          <NoteComponent
            noteData={noteData}
            modeKit={modeKit}
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
    <BottomConent controlProps={controlProps} noteData={noteData} />
  </div>
);
