import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNoteRecords } from "../../services/crudApi";
//import EditOffcanvas from "./fileEdit";
import { useAuth } from "../../../../hooks/auth";
import FileNewNote from "./fileNewNote";
import FileScroll from "./viewTypes/fileScroll";
import { Button } from "@/components/ui/button";
import { fetchFolders } from "../../services/crudApi";
import FolderScroll from "./viewTypes/folderScroll";
import FolderBox from "./viewTypes/folderBox";
import { Route, Link, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CreateFolder from "./folderView/createFolder";
import { deleteFolder } from "@/components/appPages/services/crudApi";

//overflow for records

function Files({ canvasEdit, newNoteButtonkit }) {
  const { session } = useAuth();
  const { showOffCanvasEdit, setOffCanvasEdit } = canvasEdit;
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const { newNoteField, setNewNoteField, noteID } = newNoteButtonkit;
  //this needs to be in the use effect for use State
  const targetFile = useRef(null);

  useEffect(() => {
    fetchNoteRecords(session, false).then(setFiles);
    fetchFolders(session).then(setFolders);
  }, [showOffCanvasEdit, noteID]);

  useEffect(() => {
    console.log("folders", folders);
  }, [folders]);

  const [fileView, setFileView] = useState("FolderGrid");

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
                  canvasEdit={canvasEdit}
                  files={files}
                  searchTerm={searchTerm}
                  folders={folders}
                />
              </>
            }
          />
          <Route
            path="folder-list"
            element={
              <FolderScroll
                canvasEdit={canvasEdit}
                files={files}
                folders={folders}
              />
            }
          />
          <Route
            path="folder-grid"
            element={
              <FolderBox
                canvasEdit={canvasEdit}
                files={files}
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

{
  /*

      <table className="w-full mb-2 h-7">
        <thead className="">
          <tr>
            <th
              className="ps-3 md:w-[72.5%] cursor-pointer hover:text-gray-500 text-left"
              onClick={() => handleSort("title")}
            >
              Title <i className="ms-1 bi bi-arrow-down-up"></i>
            </th>
            <th
              className="cursor-pointer hover:text-gray-500 hidden lg:flex"
              onClick={() => handleSort("date_updated")}
            >
              Date Updated{" "}
              <i className=" ms-2  bi bi-arrow-down-up my-auto "></i>
            </th>
            <th className="text-right text-right pr-2">Export</th>
          </tr>
        </thead>
      </table>
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 182px)" }}
      >
        <table className="w-full text-gray-600">
          <tbody>
            {sortedFiles.map((file, index) => (
              <tr key={index} className={`hover:bg-gray-200 border-b`}>
                <td
                  className="align-middle py-3 ps-3"
                  onClick={() => goToTask(file)}
                >
                  {file.title}
                </td>
                <td
                  className="align-middle hidden lg:table-cell py-2"
                  onClick={() => goToTask(file)}
                >
                  {new Date(file.date_updated).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="">
                  <Sheet>
                    <SheetTrigger className=" border-2 border-gray-300 p-4 w-4 h-5 flex justify-center items-center hover:bg-gray-500 rounded-lg hover:text-white">
                      <div className="  align-middle  ">
                        <i className=" bi bi-gear align-middle "></i>
                      </div>
                    </SheetTrigger>
                    <EditExportNote
                      canvasEdit={canvasEdit}
                      handleClose={handleClose}
                      file={file}
                    />
                  </Sheet>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>*/
}
