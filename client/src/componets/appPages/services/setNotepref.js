export const handleSendLLM = (instructions, session) => {
  const token = session.access_token;

  fetch(`${import.meta.env.VITE_BASE_URL}/settings/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ instructions }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const fetchLLMpref = (setTextareaValue, session) => {
  const token = session.access_token;
  fetch(`${import.meta.env.VITE_BASE_URL}/settings/notes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
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
