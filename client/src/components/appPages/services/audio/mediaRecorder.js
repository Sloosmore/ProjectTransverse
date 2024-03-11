const startRecordingMedia = (session, setRecorder, noteID) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      let mediaRecorder = new MediaRecorder(stream);
      const sendAudioData = (data) => {
        let blob = new Blob([data], { type: "audio/wav" }); // Ensure the MIME type matches the recording format
        let date = new Date();
        let formData = new FormData();
        formData.append("audio", blob, `recording_${date.toISOString()}.wav`);
        formData.append("noteID", noteID);

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
            console.log("Chunk uploaded successfully");
          })
          .catch((error) => {
            console.error("There was a problem with the upload:", error);
          });
      };
      const startNewRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            sendAudioData(event.data);
          }
        });
      };

      mediaRecorder.start();
      const recordingInterval = setInterval(startNewRecording, 30000);

      setRecorder({ mediaRecorder, recordingInterval });
    })
    .catch((error) => {
      console.error("There was a problem with the recording:", error);
      // Handle error (like user denying access)
    });
};

const stopRecordingMedia = (recorderObj) => {
  if (recorderObj) {
    const { mediaRecorder, recordingInterval } = recorderObj;
    clearInterval(recordingInterval); // Stop the interval
    console.log("recording almost stopped");

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    console.log("Recording stopped");
  }
};

export { startRecordingMedia, stopRecordingMedia };
