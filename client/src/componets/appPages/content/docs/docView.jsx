import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Chatroom() {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoad] = useState(true);

  const { task_id, prompt, filename, file, content } = location.state;

  useEffect(() => {
    setLoad(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/grabDoc-api/?filename=${filename}`)
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
