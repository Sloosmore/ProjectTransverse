import FileScroll from "../viewTypes/fileScroll";
import React, { useEffect, useState } from "react";
import {
  fetchNoteRecords,
  fetchFolders,
} from "@/components/appPages/services/crudApi";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import FileNewNote from "../fileNewNote";
import EditFolderTitle from "./folderTitle";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditExportNote from "../fileEditShad";
import { useNoteData } from "@/hooks/noteDataStore";

function FolderView({ newNoteButtonkit }) {
  const { noteData } = useNoteData();
  const { session } = useAuth();
  const { folderId } = useParams();

  const { newNoteField, setNewNoteField, noteID } = newNoteButtonkit;
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState({ title: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchFolderData = async () => {
      const folderNotes = noteData.filter(
        (note) => note.folder_id === folderId
      );
      setFiles(folderNotes);
      const folders = await fetchFolders(session);
      const folder = folders.find((folder) => folder.folder_id === folderId);
      setFolder(folder);
    };

    fetchFolderData();
  }, [folderId, noteData]);

  //this needs to be in the use effect for use State

  const navigate = useNavigate();

  const goToTask = (notes) => {
    navigate(`/app/n/${notes.note_id}`, {
      state: {
        title: notes.title,
        id: notes.note_id,
        markdown: notes.full_markdown,
        status: notes.status,
      },
    });
  };

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleSort = (field) => {
    let direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  let sortedFiles = [...files];
  if (sortField !== null) {
    sortedFiles.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Convert to Date objects if the values are dates
      if (sortField === "date_updated") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Convert to lowercase if the values are strings
      else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      return 0;
    });
  }

  if (searchTerm !== "") {
    sortedFiles = sortedFiles.filter((file) =>
      file.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="mt-5 px-6 xl:px-40 md:px-20 sm:px-10 flex-col overflow-hidden flex h-full">
      <div className="flex-none">
        <EditFolderTitle folder={folder} />
        <div className="w-full flex-row flex mb-4 justify-between">
          <button
            onClick={() => setNewNoteField(!newNoteField)}
            className=" inline-flex rounded-lg justify-between px-3 py-2.5 border-gray-300 text-sm font-semibold text-gray-500   bg-gray-100 hover:bg-gray-200 border  shadow-sm  "
          >
            <i className="bi bi-plus-lg" style={{ fontSize: "1.5rem" }}></i>
            <span className="ms-2 flex justify-center items-center w-full text-center my-auto">
              New Note
            </span>
          </button>{" "}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:w-1/3 md:w-1/2 w-7/12 py-2 px-3 border border-gray-300 rounded-md shrink shadow-sm"
          />
        </div>
      </div>
      <table className="w-full mb-2 h-7">
        <thead className="">
          <tr>
            <th
              className="ps-3 cursor-pointer hover:text-gray-500 text-left w-[71.5%] "
              onClick={() => handleSort("title")}
            >
              Title <i className="ms-1 bi bi-arrow-down-up"></i>
            </th>
            <th
              className="cursor-pointer hover:text-gray-500 hidden lg:table-cell"
              onClick={() => handleSort("date_updated")}
            >
              <div className="me-14 xl:me-16 xl:pe-4">
                Date Updated
                <i className=" ms-2  bi bi-arrow-down-up my-auto "></i>
              </div>
            </th>
            <th className="text-right text-right pr-2">Export</th>
          </tr>
        </thead>
      </table>
      <div className="flex-grow overflow-auto ">
        <table className="w-full text-gray-600">
          <tbody>
            {sortedFiles.map((file, index) => (
              <tr key={index} className={`hover:bg-gray-200 border-b`}>
                <td
                  className="align-middle py-3 ps-3 "
                  onClick={() => goToTask(file)}
                >
                  {file.title}
                </td>

                <td
                  className="align-middle hidden lg:table-cell py-2 "
                  onClick={() => goToTask(file)}
                >
                  <div className="ms">
                    {new Date(file.date_updated).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </td>
                <td className="">
                  <Sheet className="flex items-center">
                    <SheetTrigger className="border-2 border-gray-300 p-4 w-4 h-5 flex justify-center items-center hover:bg-gray-500 rounded-lg hover:text-white">
                      <div className="  align-middle  ">
                        <i className=" bi bi-gear align-middle "></i>
                      </div>
                    </SheetTrigger>
                    <EditExportNote file={file} />
                  </Sheet>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FolderView;
