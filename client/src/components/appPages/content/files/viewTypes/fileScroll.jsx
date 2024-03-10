import React from "react";
import { useState, useEffect } from "react";
//import EditOffcanvas from "./fileEdit";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditExportNote from "../fileEditShad";

//overflow for records

function FileScroll({ canvasEdit, files, folders, searchTerm }) {
  const { setOffCanvasEdit } = canvasEdit;
  //this needs to be in the use effect for use State

  const handleClose = () => setOffCanvasEdit(false);

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

  const folderName = (folder_id) => {
    const folder = folders.find((folder) => folder.folder_id === folder_id);
    return folder ? folder.title : "";
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
    <div className="h-full flex flex-col">
      <table className="w-full mb-2 h-7">
        <thead className="">
          <tr>
            <th
              className="ps-3 cursor-pointer hover:text-gray-500 text-left w-[72.5%] lg:w-[63%] "
              onClick={() => handleSort("title")}
            >
              Title <i className="ms-1 bi bi-arrow-down-up"></i>
            </th>
            <th
              className="cursor-pointer hover:text-gray-500 hidden lg:table-cell"
              onClick={() => handleSort("folder_id")}
            >
              Folder Name
            </th>
            <th
              className="cursor-pointer hover:text-gray-500 hidden lg:table-cell"
              onClick={() => handleSort("date_updated")}
            >
              Date Updated
              <i className=" ms-2  bi bi-arrow-down-up my-auto "></i>
            </th>
            <th className="text-right text-right pr-2">Export</th>
          </tr>
        </thead>
      </table>
      <div className="overflow-auto flex-grow">
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
                  className="align-middle hidden lg:table-cell py-3 pe-6"
                  onClick={() => goToTask(file)}
                >
                  {folderName(file.folder_id)}
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
                    <SheetTrigger className="border-2 border-gray-300 p-4 w-4 h-5 flex justify-center items-center hover:bg-gray-500 rounded-lg hover:text-white">
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
      </div>
    </div>
  );
}

export default FileScroll;