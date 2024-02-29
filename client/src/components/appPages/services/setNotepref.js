export const handleSendLLM = (instructions, frequency, pref_num, session) => {
  const token = session.access_token;

  fetch(`${import.meta.env.VITE_BASE_URL}/settings/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ instructions, frequency, pref_num }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const fetchLLMpref = (
  setPreferences,
  setActiveNum,
  setFrequency,
  session
) => {
  console.log(session);
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
      setFrequency(body.frequency);
      console.log(body.instructions);
      setPreferences(body.instructions);
      setActiveNum(body.pref_num);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
