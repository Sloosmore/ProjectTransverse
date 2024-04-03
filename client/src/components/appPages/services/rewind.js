export const rewindContext = async (session, note_id, transcript, caption) => {
  const token = session.access_token;

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/rewind`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ note_id, transcript, caption }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const markdown = data.markdown;
  return markdown;
};
