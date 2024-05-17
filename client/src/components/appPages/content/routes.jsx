import { Routes, Route } from "react-router-dom";
import Files from "./files/files";
import BottomConent from "./bottom/bottomContent";
import AppNav from "./top/appNav";
import NoteComponent from "./novel/editorWrapper";
import FolderView from "./files/folderView/folderView";
//import Editor from "./tiptapNotes/editor";
import RewindProvider from "@/hooks/noteHooks/aiRewind";

export const AppRoutes = ({ controlProps }) => (
  <div className="flex flex-col h-dvh">
    <AppNav />
    <RewindProvider>
      <Routes>
        <Route path="n/:noteId" element={<NoteComponent />} />
        <Route path="f/:folderId" element={<FolderView />} />
        <Route path="/*" element={<Files />} />
      </Routes>
    </RewindProvider>
    <BottomConent />
  </div>
);
