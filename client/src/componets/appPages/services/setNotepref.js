export const handleSendLLM = (instructions) => {
  fetch("/settings/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instructions }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const fetchLLMpref = (setTextareaValue) => {
  fetch("/settings/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((body) => {
      console.log(body["instructions"]);
      setTextareaValue(body.instructions);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
