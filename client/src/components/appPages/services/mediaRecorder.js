const startRecordingMedia = (session, setRecorder, noteID) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        let blob = new Blob([event.data], { type: "audio/wav" });
        console.log("Created blob", blob); // Log created blob

        let date = new Date();
        let formData = new FormData();
        formData.append("audio", blob, `${date}.wav`);
        formData.append("noteID", noteID);
        console.log("Created entries", formData.entries()); // Log FormData
        console.log("Created FormData", formData); // Log FormData
        const token = session.access_token;

        fetch(`${import.meta.env.VITE_BASE_URL}/audio/upload`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.blob();
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          });
      });
      setRecorder(mediaRecorder);

      mediaRecorder.start(30000);
      console.log("recording started");
    })
    .catch((error) => {
      // Handle error (like user denying access)
    });
};

const stopRecordingMedia = (recorder) => {
  if (recorder) {
    console.log("Recorder state before stop:", recorder.state);
    recorder.stop();
    recorder.stream.getTracks().forEach((track) => {
      console.log("Track readyState before stop:", track.readyState);
      track.stop();
    });
    console.log("Recorder state after stop:", recorder.state);
    console.log("stop recording");
  }
};

export { startRecordingMedia, stopRecordingMedia };
