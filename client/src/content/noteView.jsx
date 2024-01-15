import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

function Noteroom() {
  const location = useLocation();

  const { title, id, markdown } = location.state;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="text-secondary text-center container-fluid px-5">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Noteroom;
