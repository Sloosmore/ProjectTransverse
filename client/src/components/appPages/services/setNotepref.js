export const handleSendLLM = (instructions, frequency, session) => {
  const token = session.access_token;

  fetch(`${import.meta.env.VITE_BASE_URL}/settings/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ instructions, frequency }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const fetchLLMpref = (setTextareaValue, setFrequency, session) => {
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
      setTextareaValue(body.instructions);
      setFrequency(body.frequency);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
