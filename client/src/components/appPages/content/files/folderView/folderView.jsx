import React, { useEffect, useState } from "react";
import { fetchFolders } from "@/api/crud/folder/readFolders";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/userHooks/auth";
import EditFolderTitle from "./folderTitle";
import { useNavigate } from "react-router-dom";
import EditExportNote from "../fileEditShad";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { useNewNote } from "@/hooks/noteHooks/newNote";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

function FolderView({}) {
  const { noteData } = useNoteData();
  const { session } = useAuth();
  const { folderId } = useParams();

  const { newNoteField, setNewNoteField } = useNewNote();
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState({ title: "" });
  const [searchTerm, setSearchTerm] = useState("");

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
            className=" inline-flex rounded-lg justify-between px-3 py-2.5 border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:bg-gray-900 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 border  shadow-sm  "
          >
            <i className="bi bi-plus-lg" style={{ fontSize: "1.5rem" }}></i>
            <span className="ms-2 flex justify-center items-center w-full text-center my-auto">
              New Note
            </span>
          </button>{" "}
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:w-1/3 md:w-1/2 w-7/12 py-2 px-3 border border-gray-300 rounded-md shrink shadow-sm"
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[500px]">Title</TableHead>
              <TableHead className="sm:w-[8rem] text-center flex items-center">
                Date
              </TableHead>
              <TableHead className=" w-10">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFiles.map((file, index) => (
              <TableRow key={index}>
                <TableCell
                  className="align-middle py-3 ps-3 text-base"
                  onClick={() => goToTask(file)}
                >
                  {file.title}
                </TableCell>
                <TableCell onClick={() => goToTask(file)}>
                  {new Date(file.date_updated).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="">
                  <div className="ms-auto">
                    <EditExportNote file={file} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default FolderView;
