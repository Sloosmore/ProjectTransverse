import React from "react";
import { useState, useEffect } from "react";
import { fetchNoteRecords } from "../services/crudApi";

function Files() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    fetchNoteRecords(false).then(setFiles);
  }, []);

  useEffect(() => {
    //grab all files for a specific user
    //set in a state
  }, []);

  return (
    <div>
      <h1>Files</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date Updated</th>
            <th scope="col">Visible</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.title}</td>
              <td>{file.date_updated}</td>
              <td>{file.visible.toString()}</td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Files;
