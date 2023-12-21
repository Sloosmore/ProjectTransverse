import "./panel.css";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function Home() {
  /*const csrfToken = Cookies.get("csrftoken");
  const [file, setFile] = useState(null);

  const handleInput = (event) => {
    setFile(event.target.files[0]);
  };

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("audio_file", file);

    axios
      .post("http://127.0.0.1:8000/api/transcript/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }*/

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
          <h1 className="mt-5">Just start talking</h1>
          <h3>saying transverse will execute your command</h3>
        </div>
      </div>
    </div>
  );
}

export default Home;
