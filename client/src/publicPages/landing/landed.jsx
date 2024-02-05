import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import TranverseNote from "../../assets/TransverseNote.png";
import "./blockText.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LoadLine from "./load";
import { mdList, titlesList } from "./markDownSample";
import grey from "../../assets/greyTv.svg";

export function BlockText() {
  const [textValue, setTextValue] = useState("loading");
  const [randList, setRandList] = useState();

  useEffect(() => {
    const intervalId = setInterval(() => {
      let randomInt = Math.floor(Math.random() * 4) + 1;
      while (randomInt === randList) {
        randomInt = Math.floor(Math.random() * 4) + 1;
      }
      setRandList(randomInt);
      setTextValue("loading");
      const timeoutId = setTimeout(() => {
        setTextValue("done");
      }, 2500);

      // Clear the timeout when the interval is cleared
      return () => clearTimeout(timeoutId);
    }, 6000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className=" justify-content-center align-items-center vh-100 bg-light shadow-lg px-5 px-lg-0"
      style={{ overflowX: "hidden", backgroundColor: "#F7F9FB" }}
    >
      <div className="row min-vh-100 py-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 ">
        <div className="col-lg-7 p-3 p-lg-5 pt-lg-3 d-flex flex-column">
          <img
            src={grey}
            alt=""
            style={{
              width: "3rem",
              height: "3rem",
              position: "absolute",
              top: "20px",
              left: "25px",
            }}
          />

          <p className="text-black-50 mt-sm-5">V1.0 in beta now</p>
          <h1 className=" fw-bold lh-1 gradient-text pb-2 pe-2 w-100">
            Take notes your way in {titlesList[randList]}
          </h1>

          <div className="text-lg text-muted ms-1 fs-5">
            {textValue === "loading" && <LoadLine />}
            {textValue === "done" && (
              <ReactMarkdown>{mdList[randList]}</ReactMarkdown>
            )}
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3 ">
            <button
              type="button"
              className="btn btn-lg px-4 me-md-2 gradient-bg"
            >
              Sign up
            </button>
            <button
              type="button"
              className="px-4 btn-custom d-flex align-items-center justify-content-center"
            >
              Log in
              <i
                className="bi bi-arrow-right-short ms-1"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </button>
          </div>
        </div>
        <div className="col-lg-4 offset-lg-1 p-0 shadow-lg img-fluid rounded ">
          <img
            className=" bg-light rounded"
            src={TranverseNote}
            alt=""
            width="840"
          />
        </div>
      </div>
    </div>
  );
}

export default BlockText;
