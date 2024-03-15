const startRecordingMedia = (session, setRecorder, noteID) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      let mediaRecorder = new MediaRecorder(stream);
      let audioChunks = []; // Array to store audio chunks

      const sendAudioData = () => {
        let blob = new Blob(audioChunks, { type: "audio/wav" }); // Combine chunks into a single Blob
        let date = new Date();
        let formData = new FormData();
        formData.append("audio", blob, `recording_${date.toISOString()}.wav`);
        formData.append("noteID", noteID);

        const token = session.access_token;
        console.log("sending audio data");
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
            console.log("Recording uploaded successfully");
          })
          .catch((error) => {
            console.error("There was a problem with the upload:", error);
          });
      };

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          console.log("Audio data available");
          audioChunks.push(event.data); // Append chunk to array
          sendAudioData();
        }
      });
      console.log("Recording started");
      mediaRecorder.start(30000); // Start recording and slice audio data every 30 seconds

      setRecorder({ mediaRecorder, sendAudioData });
    })
    .catch((error) => {
      console.error("There was a problem with the recording:", error);
      // Handle error (like user denying access)
    });
};

const stopRecordingMedia = (recorderObj) => {
  if (recorderObj) {
    const { mediaRecorder, sendAudioData } = recorderObj;

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());

    sendAudioData(); // Send combined audio data when recording is stopped

    console.log("Recording stopped");
  }
};

export { startRecordingMedia, stopRecordingMedia };
