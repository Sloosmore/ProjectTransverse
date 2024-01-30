import React from "react";
import { useState, useEffect } from "react";

function Files() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    //grab all files for a specific user
    //set in a state
  }, []);

  return (
    <div>
      <h1>Files</h1>
    </div>
  );
}

export default Files;
