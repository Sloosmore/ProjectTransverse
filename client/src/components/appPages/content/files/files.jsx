import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNoteRecords } from "../../services/crudApi";
//import EditOffcanvas from "./fileEdit";
import { useAuth } from "../../../../hooks/auth";
import FileNewNote from "./fileNewNote";
import FileScroll from "./viewTypes/fileScroll";
import { fetchFolders } from "../../services/crudApi";
import FolderScroll from "./viewTypes/folderScroll";
import FolderBox from "./viewTypes/folderBox";
import { Route, Link, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CreateFolder from "./folderView/createFolder";
import { deleteFolder } from "@/components/appPages/services/crudApi";
import { useNoteData } from "@/hooks/noteDataStore";

//overflow for records

function Files({ newNoteButtonkit }) {
  const { setNotes, noteData } = useNoteData();
  const { session } = useAuth();
  const [folders, setFolders] = useState([]);
  const { newNoteField, setNewNoteField, noteID } = newNoteButtonkit;
  //this needs to be in the use effect for use State

  useEffect(() => {
    fetchFolders(session).then(setFolders);
  }, [noteID]);

  useEffect(() => {
    console.log("folders", folders);
  }, [folders]);

  const fileViewArray = [
    {
      view: "folder-grid",
      icon: "bi bi-archive",
    },
    {
      view: "folder-list",
      icon: "bi bi-folder2",
    },

    {
      view: "files",
      icon: "bi bi-card-list",
    },
  ];

  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteFolder = (folder_id) => {
    deleteFolder(folder_id, session).then((res) => {
      console.log("res", res);
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
          {fileViewArray.map((item, index) => (
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
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <Routes>
          <Route
            path="files"
            element={
              <>
                <div className="w-full flex-row mb-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="lg:w-1/3 md:w-1/2 w-7/12 py-2 px-3 border border-gray-300 rounded-md shrink shadow-sm"
                  />
                </div>
                <FileScroll
                  files={noteData}
                  searchTerm={searchTerm}
                  folders={folders}
                />
              </>
            }
          />
          <Route
            path="folder-list"
            element={<FolderScroll files={noteData} folders={folders} />}
          />
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
