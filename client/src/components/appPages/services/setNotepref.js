const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

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
  if (inDevelopment) console.log(session);
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
      const preferences = {
        note: body.instructions,
        diagram: body.diagram_instructions,
      };

      const activeNum = {
        note: body.pref_num,
        diagram: body.diagram_pref_numb,
      };

      setFrequency(body.frequency);
      console.log(body.instructions);
      setPreferences(preferences);
      setActiveNum(activeNum);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
