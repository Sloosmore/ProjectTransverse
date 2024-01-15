import "./panel.css";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function Home(props) {
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
          <h1 className="mt-5">{props.transcript}</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
