import React from "react";
import { useState, useEffect, useRef } from "react";
//import EditOffcanvas from "./fileEdit";
import { useAuth } from "../../../../hooks/userHooks/auth";
import FileNewNote from "./fileNewNote";
import { fetchFolders } from "@/api/crud/folder/readFolders";
import FolderBox from "./viewTypes/folderBox";
import { Route, Link, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { deleteFolder } from "@/api/crud/folder/deleteFolder";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { useNewNote } from "@/hooks/noteHooks/newNote";

//overflow for records
const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

function Files({}) {
  const { setNotes, noteData, noteID } = useNoteData();
  const { session } = useAuth();
  const [folders, setFolders] = useState([]);
  const { newNoteField, setNewNoteField } = useNewNote();
  //this needs to be in the use effect for use State

  useEffect(() => {
    fetchFolders(session).then(setFolders);
  }, [noteID]);

  useEffect(() => {
    if (inDevelopment) {
      console.log("folders", folders);
    }
  }, [folders]);

  const fileViewArray = [
    {
      view: "folder-grid",
      icon: "bi bi-archive",
    },
  ];

  /*    {
      view: "files",
      icon: "bi bi-card-list",
    }, 
        {
      view: "folder-list",
      icon: "bi bi-folder2",
    },
    */

  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteFolder = (folder_id) => {
    deleteFolder(folder_id, session).then((res) => {
      if (inDevelopment) {
        console.log("res", res);
      }
      fetchFolders(session).then(setFolders);
    });
  };

  return (
    <div className=" px-6 xl:px-40 md:px-20 sm:px-10 flex-col h-full overflow-hidden flex">
      <div
        className={`mb-4 mt-3 flex align-center h-12 justify-between flex-none`}
      >
        <FileNewNote
          setNewNoteField={setNewNoteField}
          newNoteField={newNoteField}
        />

        <div className="flex items-center gap-x-4 me-2 text-gray-400">
          {/*  {fileViewArray.map((item, index) => (
            <Link
              key={index}
              to={`${item.view}`}
              className={`flex items-center hover:text-gray-500 ${
                location.pathname.endsWith(item.view) ? "text-gray-600" : ""
              }`}
            >

              <i
                className={`${item.icon} `}
                style={{ fontSize: "1.25rem" }}
              ></i>
            </Link>
          ))} */}
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <Routes>
          <Route
            path="folder-grid"
            element={
              <FolderBox
                files={noteData}
                folders={folders}
                handleDeleteFolder={handleDeleteFolder}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Files;
