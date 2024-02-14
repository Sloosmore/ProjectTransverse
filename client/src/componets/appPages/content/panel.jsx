import "./panel.css";
import React, { useState, useEffect } from "react";
import HelpModal from "../modalsToast/help";

function Home({ transcript, helpModalKit }) {
  const { showHelpModal, setShowHelpModal, closeModal } = helpModalKit;
  const [onload, setLoad] = useState(
    localStorage.getItem("pageLoaded") !== null
      ? localStorage.getItem("pageLoaded") === "true"
      : false
  );

  useEffect(() => {
    if (onload) {
      localStorage.setItem("pageLoaded", onload);
    }
  }, [onload]);

  useEffect(() => {
    if (onload && transcript) {
      setTimeout(() => {
        setLoad("false");
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
          {(onload === "true" && (
            <>
              <h1 className="mt-5">Welcome to Transverse!</h1>
              <h4>
                Say help or press the question mark box to get started or start
                talking if you know what you're doing.
              </h4>
            </>
          )) || <h1 className="mt-5">{transcript}</h1>}
        </div>
      </div>

      <button
        className="position-absolute bottom-0 end-0 m-4 btn btn-outline-secondary rounded-circle"
        onClick={() => setShowHelpModal(true)}
      >
        <i className="bi bi-question-lg" style={{ fontSize: "1.5rem" }}></i>
      </button>
      <div>
        <HelpModal show={showHelpModal} onClose={closeModal} />
      </div>
    </div>
  );
}

export default Home;
