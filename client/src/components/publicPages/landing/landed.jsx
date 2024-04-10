import React from "react";
import "./blockText.css";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import LoadLine from "./load";
import { mdList, titlesList } from "./markDownSample";
import grey from "../../../assets/greyFull.png";
import Open from "../../../assets/novelLanding.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/auth";
import loadVideo from "../../../assets/Onload video.mp4";
import loadVideoMov from "../../../assets/Onload video.mov";

import afterVid from "../../../assets/afterVid.png";

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

  const videoRef = useRef(null);

  useEffect(() => {
    // Access the video element from the ref
    const videoElement = videoRef.current;

    // Prevent looping by setting the loop attribute to false
    videoElement.loop = false;
  }, []);

  return (
    <div className="flex w-screen bg-light  px-5 overflow-hidden lg:pt-40 lg:pb-20 lg:mb-10">
      <div className="py-4 pb-0 pt-5 lg:items-center rounded-3 flex lg:flex-row flex-col mb-6">
        <div className="lg:grow md:mb-0 mb-10 md:p-10 pt-3 xl:w-[110rem] lg:w-[90rem] lg:me-10">
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
          <div className="mt-16 ms-5">
            <p className="text-gray-500 mt-20 lg:mt-5 mb-1">V1.4 in beta now</p>
            <h1 className="font-bold leading-none pe-2 w-full text-gray-400">
              <span className="gradient-text text-5xl	">
                Focus On What Matters.
              </span>
            </h1>
            <h2 className="text-gray-400 mt-2">
              Your partner in effortless and efficient notetaking
            </h2>
            <div className="mt-6">
              <Link to="/getin">
                <div className="text-white">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600"
                    style={{
                      transition: "all .15s ease",
                      boxShadow: "0 0 0 0 rgba(127, 90, 179, 0)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow =
                        "0 0 2px 2px rgba(127, 90, 179, 0.7)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow =
                        "0 0 0 0 rgba(127, 90, 179, 0)";
                    }}
                  >
                    Join Waitlist
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-[200%] sm:w-[100%] sm:px-10 md:px-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop={false}
            className="rounded shadow-xl ml-auto ring-2 ring-gray-200 ring-opacity-50"
            style={{ width: "100%" }}
          >
            <source src={loadVideoMov} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default BlockText;

/*

       <div className="text-lg text-gray-500 ms-1 fs-5 h-36">
              {textValue === "loading" && <LoadLine />}
              {textValue === "done" && (
                <ReactMarkdown>{mdList[randList]}</ReactMarkdown>
              )}
            </div>


             <div className="flex gap-2 mb-4 mt-4">
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
*/
