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

  return (
    <div className="mt-3 px-3 d-flex flex-column">
      <div className="mb-2 mt-3">
        <FileNewNote
          setNewNoteField={setNewNoteField}
          newNoteField={newNoteField}
        />
      </div>
      <div
        className="table-responsive overflow-auto flex-grow-1"
        style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
      >
        <table className="table table-hover">
          <tbody className="">
            {files.map((file, index) => (
              <tr key={index} onClick={() => goToTask(file)}>
                <td className="align-middle">{file.title}</td>
                <td className="align-middle d-none d-md-table-cell">
                  {file.date_updated}
                </td>
                <td className="align-middle">
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
