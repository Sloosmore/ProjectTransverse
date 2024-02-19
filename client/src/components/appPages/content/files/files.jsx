import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNoteRecords } from "../../services/crudApi";
import EditOffcanvas from "./fileEdit";
import { useAuth } from "../../../../hooks/auth";
import FileNewNote from "./fileNewNote";
import { useNavigate } from "react-router-dom";

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

      // Convert to lowercase if the values are strings
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="mt-3 px-6 lg:px-40 md:px-20 sm:px-10 flex-column h-full ">
      <div className="mb-4 mt-3 ">
        <FileNewNote
          setNewNoteField={setNewNoteField}
          newNoteField={newNoteField}
        />
      </div>
      <table className="w-full mb-2 ">
        <thead className="flex-col">
          <tr>
            <th
              className="ps-3 md:w-[52.5%] cursor-pointer hover:text-gray-500"
              onClick={() => handleSort("title")}
            >
              Title <i className="ms-2 bi bi-arrow-down-up"></i>
            </th>
            <th
              className="cursor-pointer hover:text-gray-500 hidden md:flex"
              onClick={() => handleSort("date_updated")}
            >
              Date Updated{" "}
              <i className=" ms-2  bi bi-arrow-down-up my-auto "></i>
            </th>
            <th className="text-right pr-4 lg:pr-12">Export</th>
          </tr>
        </thead>
      </table>
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 175px)" }}
      >
        <table className="w-full">
          <tbody>
            {sortedFiles.map((file, index) => (
              <tr
                key={index}
                onClick={() => goToTask(file)}
                className={`hover:bg-gray-200 border-b `}
              >
                <td className="align-middle py-2 ps-3">{file.title}</td>
                <td className="align-middle d-none d-md-table-cell py-2">
                  {file.date_updated}
                </td>
                <td className="align-middle py-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOffCanvasShow(file);
                    }}
                  >
                    <i className="bi bi-gear"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditOffcanvas
        canvasEdit={canvasEdit}
        handleClose={handleClose}
        file={targetFile.current}
      />
    </div>
  );
}

export default Files;
