import { useParams, useLocation } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { useEffect, useState } from "react";

function Chatroom() {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoad] = useState(true);

  const { task_id, prompt, filename, file, content } = location.state;

  useEffect(() => {
    setLoad(true);
    fetch(`/grabDoc-api/?filename=${filename}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Before blob:", response.bodyUsed); // Should be false
        return response.blob();
      })
      .then((blob) => {
        // Create a local URL for the blob
        const localUrl = URL.createObjectURL(blob);
        setPdfUrl(localUrl);
        setLoad(false);
      })
      .catch((error) => console.error("Error fetching document:", error));
  }, [filename]);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="text-secondary text-center container-fluid px-5">
        <p>Filename: {filename}</p>
        <p>Prompt: {prompt}</p>
        <hr />
        <div>
          {loading ? (
            <div>Loading document...</div> // Replace with your loading spinner or component
          ) : (
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatroom;

/*
        
<div className="text-center">
          <DocViewer documents={doc} pluginRenderers={DocViewerRenderers} />
        </div>
        let { PythonShell } = require("python-shell");
  const path = require("path");
  const fs = require("fs");

    useEffect(() => {
    if (fs.existsSync(`../public/docs/${filname}`)) {
      let options = {
        scriptPath: path.join(__dirname, "./pyCode/docGen.py"),
        args: content,
      };
      PythonShell.run(Filepath, options, (err, results) => {
        if (err) console.log(err);
      });
    }
  }, []);
 */
