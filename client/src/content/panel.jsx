import "./panel.css";
import React, { useState, useEffect } from "react";

function Home({ transcript, helpModal }) {
  const [onload, setLoad] = useState(
    localStorage.getItem("pageLoaded") === "false"
  );

  useEffect(() => {
    if (onload) {
      localStorage.setItem("pageLoaded", "true");
    }
  }, [onload]);

  useEffect(() => {
    if (onload && transcript) {
      setTimeout(() => {
        setLoad(false);
      }, 2000);
    }
  }, [transcript]);
  return (
    <div>
      <div className="text-center"></div>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div className="text-secondary text-center">
          <div className="donut mx-auto d-block mb-2"></div>
          <br />
          {onload ? (
            <>
              <h1 className="mt-5">Welcome to Transverse!</h1>
              <h3>Say help or press the question mark box to get started</h3>
            </>
          ) : (
            <h1 className="mt-5">{transcript}</h1>
          )}
        </div>
      </div>

      <button
        className="position-absolute bottom-0 end-0 m-4 btn btn-outline-secondary rounded-circle"
        onClick={() => helpModal(true)}
      >
        <i className="bi bi-question-lg" style={{ fontSize: "1.5rem" }}></i>
      </button>
    </div>
  );
}

export default Home;
