import React from "react";
import TranverseNote from "../../../assets/TransverseNote.png";
import "./blockText.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LoadLine from "./load";
import { mdList, titlesList } from "./markDownSample";
import grey from "../../../assets/verse.png";
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
    <div className="flex w-screen bg-light  px-5 overflow-hidden lg:pt-40 lg:pb-20 lg:mb-10 ">
      <div className="py-4 pb-0 pt-5 lg:items-center rounded-3 flex lg:flex-row flex-col">
        <div className="lg:grow p-5 pt-3 xl:w-[110rem] lg:w-[90rem] lg:me-10">
          <img
            src={grey}
            alt=""
            className="absolute"
            style={{
              width: "8rem",
              height: "auto",
              top: "35px",
              left: "35px",
            }}
          />
          <div className="mt-20 ms-5">
            <p className="text-gray-500 mt-20 lg:mt-5 mb-2">V1.3 in beta now</p>
            <h1 className="font-bold leading-none gradient-text pb-4 pe-2 w-full">
              Take notes your way in {titlesList[randList]}
            </h1>

            <div className="text-lg text-gray-500 ms-1 fs-5 h-36">
              {textValue === "loading" && <LoadLine />}
              {textValue === "done" && (
                <ReactMarkdown>{mdList[randList]}</ReactMarkdown>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              <Link to="/login">
                <div className="text-white">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600"
                  >
                    {(user && "Log in") || "Sign up"}
                  </button>
                </div>
              </Link>
              <Link to="/about">
                <button
                  type="button"
                  className="px-4 flex items-center justify-center"
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
        </div>
        <div className="w-[200%] sm:w-[100%]">
          <img
            className="rounded shadow-xl ml-auto ring-2 ring-gray-200 ring-opacity-50"
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
