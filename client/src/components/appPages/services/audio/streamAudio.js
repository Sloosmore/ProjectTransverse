const fetchURLs = async (session, noteID) => {
  try {
    const token = session.access_token;

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/audio/stream?noteID=${noteID}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      const { segData } = data;
      return segData;
    } else {
      console.error("Error grabbing urls:", response);
      return null;
    }
  } catch (error) {
    console.error("Error in streamAudio:", error);
  }
};

export { fetchURLs };
