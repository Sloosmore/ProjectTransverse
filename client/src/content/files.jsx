import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNoteRecords } from "../services/crudApi";
import EditOffcanvas from "./fileEdit";

function Files() {
  const [files, setFiles] = useState([]);
  const [showOffCanvas, setOffCanvasShow] = useState(false);
  const targetFile = useRef(null);

  useEffect(() => {
    fetchNoteRecords(false).then(setFiles);
  }, [showOffCanvas]);

  const handleOffCanvasShow = (file) => {
    targetFile.current = file;
    setOffCanvasShow(true);
  };
  const handleClose = () => setOffCanvasShow(false);

  useEffect(() => {
    //grab all files for a specific user
    //set in a state
  }, []);

  return (
    <div className="mt-3 px-3">
      <h1>Files</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date Updated</th>
            <th scope="col">Visible in sidebar</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td className="align-middle">{file.title}</td>
              <td className="align-middle">{file.date_updated}</td>
              <td className="align-middle">{file.visible.toString()}</td>
              <td>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    handleOffCanvasShow(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditOffcanvas
        show={showOffCanvas}
        handleClose={handleClose}
        file={targetFile.current}
      />
    </div>
  );
}

export default Files;
