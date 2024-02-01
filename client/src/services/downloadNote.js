export const sendDownload = (noteID, radioValue) => {
  const format = radios[radioValue].name; // Get the selected format

  fetch("/records-api/notes-download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ noteID, format }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      // Use the blob to initiate a download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `file.${format.toLowerCase()}`; // Use the appropriate filename and extension
      a.click();
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};
