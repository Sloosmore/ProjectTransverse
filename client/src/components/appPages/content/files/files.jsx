import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNoteRecords } from "../../services/crudApi";
//import EditOffcanvas from "./fileEdit";
import { useAuth } from "../../../../hooks/auth";
import FileNewNote from "./fileNewNote";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditExportNote from "./fileEditShad";

//overflow for records

function Files({ canvasEdit, newNoteButtonkit }) {
  const { session } = useAuth();
  const { showOffCanvasEdit, setOffCanvasEdit } = canvasEdit;
  const [files, setFiles] = useState([]);
  const { newNoteField, setNewNoteField, noteID } = newNoteButtonkit;
  //this needs to be in the use effect for use State
  const targetFile = useRef(null);

  useEffect(() => {
    fetchNoteRecords(session, false).then(setFiles);
  }, [showOffCanvasEdit, noteID]);

  const handleOffCanvasShow = (file) => {
    targetFile.current = file;
    setOffCanvasEdit(true);
  };
  const handleClose = () => setOffCanvasEdit(false);

  const navigate = useNavigate();

  const goToTask = (notes) => {
    navigate(`/n/${notes.note_id}`, {
      state: {
        title: notes.title,
        id: notes.note_id,
        markdown: notes.full_markdown,
        status: notes.status,
      },
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
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
    <div className=" px-6 xl:px-40 md:px-20 sm:px-10 flex-col flex-grow overflow-hidden">
      <div className="mb-4 mt-3 flex justify-between align-center h-12">
        <FileNewNote
          setNewNoteField={setNewNoteField}
          newNoteField={newNoteField}
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="lg:w-1/3 md:w-1/2 w-7/12 py-2 px-3 border border-gray-300 rounded-md shrink shadow-sm"
        />
      </div>
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

                  {/*
                  <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOffCanvasShow(file);
                    }}
                  >
                    <i className="bi bi-gear"></i>
                  </button>*/}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*
      <EditOffcanvas
        canvasEdit={canvasEdit}
        handleClose={handleClose}
        file={targetFile.current}
                />*/}
    </div>
  );
}

export default Files;
