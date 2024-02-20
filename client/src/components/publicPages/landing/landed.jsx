import React from "react";
import TranverseNote from "../../../assets/TransverseNote.png";
import "./blockText.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LoadLine from "./load";
import { mdList, titlesList } from "./markDownSample";
import grey from "../../../assets/greyFull.png";
import Open from "../../../assets/TScreenshotOpen.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/auth";

export function BlockText() {
  const { user } = useAuth();
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
      }, 1500);

      // Clear the timeout when the interval is cleared
      return () => clearTimeout(timeoutId);
    }, 3500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="flex h-screen w-screen bg-light shadow-lg px-5 px-lg-0 "
      style={{ overflowX: "hidden", overflowY: "hidden" }}
    >
      <div className=" py-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 lg:flex">
        <div className="grow p-lg-5 pt-lg-3 xl:w-[120rem] lg:w-[110rem] ">
          <img
            src={grey}
            alt=""
            style={{
              width: "12rem",
              height: "auto",
              position: "absolute",
              top: "35px",
              left: "35px",
            }}
          />

          <p className="text-black-50 mt-20 lg:mt-5">V1.1 in beta now</p>
          <h1 className=" fw-bold lh-1 gradient-text pb-2 pe-2 w-100">
            Take notes your way in {titlesList[randList]}
          </h1>

          <div className="text-lg text-muted ms-1 fs-5">
            {textValue === "loading" && <LoadLine />}
            {textValue === "done" && (
              <ReactMarkdown>{mdList[randList]}</ReactMarkdown>
            )}
          </div>
          <div className="flex  gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3 ">
            <Link to="/login">
              <div className="text-white">
                <button
                  type="button"
                  className="px-4 me-md-2  bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600 hover:bg-transparent py-2 rounded-md"
                >
                  {(user && "Log in") || "Sign up"}
                </button>
              </div>
            </Link>
            <Link to="/about">
              <button
                type="button"
                className="px-4 btn-custom d-flex align-items-center justify-content-center"
              >
                Learn more
                <i
                  className="bi bi-arrow-right-short ms-1"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </button>
            </Link>
          </div>
        </div>
        <div className=" w-[200%] sm:w-[100%] ">
          <img
            className=" rounded shadow-xl ml-auto ring-2 ring-gray-200 ring-opacity-50"
            src={Open}
            alt=""
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
}

export default BlockText;
