import React, { useEffect } from "react";

const AudioRecorderComponent = () => {
  function sendToServer(blob) {
    fetch(`/v-api`, {
      method: "POST",
      body: blob,
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((text) => console.log("data sent"))
      .catch((err) => {
        console.log(err);
      });
  }

  function record_and_send(stream) {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = (e) =>
      sendToServer(new Blob(chunks, { type: "audio/webm;codecs=opus" }));
    setTimeout(() => recorder.stop(), 5000);
    recorder.start();
  }

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      // Chunks is genrally a list (const chunks = []) but I am making it a let because I want to overwrite it every time

      const onSuccess = (stream) => {

        setInterval(()=>record_and_send(stream), 5000);
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(onSuccess)
        .catch((error) => console.log("Error getting media", error));
    }
  }, []);

  return <div>{/* UI elements here, if any */}</div>;
};

export default AudioRecorderComponent;
