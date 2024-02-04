import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNoteRecords } from "../../services/crudApi";
import EditOffcanvas from "./fileEdit";

//overflow for records

function Files({ canvasEdit }) {
  const { showOffCanvasEdit, setOffCanvasEdit } = canvasEdit;
  const [files, setFiles] = useState([]);
  //this needs to be in the use effect for use State
  const targetFile = useRef(null);

  useEffect(() => {
    fetchNoteRecords(false).then(setFiles);
  }, [showOffCanvasEdit]);

  const handleOffCanvasShow = (file) => {
    targetFile.current = file;
    setOffCanvasEdit(true);
  };
  const handleClose = () => setOffCanvasEdit(false);

  useEffect(() => {
    //grab all files for a specific user
    //set in a state
  }, []);

  return (
    <div className="mt-3 px-3">
      <h1>Files</h1>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date Updated</th>
              <th scope="col">Visible in sidebar</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody style={{ maxHeight: "80vh", overflow: "auto" }}>
            {files.map((file, index) => (
              <tr key={index}>
                <td className="align-middle">{file.title}</td>
                <td className="align-middle">{file.date_updated}</td>
                <td className="align-middle">{file.visible.toString()}</td>
                <td className="align-middle">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      handleOffCanvasShow(file);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
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
