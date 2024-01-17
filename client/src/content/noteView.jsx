import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import LoadNote from "./noteload";

function Noteroom() {
  const location = useLocation();

  const { title, id, markdown, status } = location.state;

  useEffect(() => {
    console.log("updated");
  }, [location.state]);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="text-secondary container-fluid px-5 overflow-auto"
        style={{ height: "100vh" }}
      >
        <br />
        <ReactMarkdown>{markdown}</ReactMarkdown>
        {status === "active" && <LoadNote />}
      </div>
    </div>
  );
}

export default Noteroom;
