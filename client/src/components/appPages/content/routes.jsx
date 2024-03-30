import { Routes, Route } from "react-router-dom";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import AppNav from "./top/appNav";
import NoteComponent from "./novel/editorWrapper";
import FolderView from "./files/folderView/folderView";
//import Editor from "./tiptapNotes/editor";
export const AppRoutes = ({ controlProps, newNoteButtonkit, pauseProps }) => (
  <div className="flex flex-col h-screen">
    <AppNav />
    <Routes>
      <Route
        path="n/:noteId"
        element={<NoteComponent pauseProps={pauseProps} />}
      />
      <Route
        path="f/:folderId"
        element={<FolderView newNoteButtonkit={newNoteButtonkit} />}
      />
      <Route
        path="/*"
        element={<Files newNoteButtonkit={newNoteButtonkit} />}
      />
    </Routes>
    <BottomConent controlProps={controlProps} />
  </div>
);
