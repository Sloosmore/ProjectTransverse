const streamAudio = async (session, NoteID, startTime) => {
  try {
    const token = session.access_token;
    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/audio/stream?noteID=${NoteID}&startTime=${startTime}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.status === 200) {
      const audioStream = response.body;
      return audioStream;
    } else {
      console.error("Error streaming audio:", response);
      return null;
    }
  } catch (error) {
    console.error("Error in streamAudio:", error);
  }
};

export { streamAudio };
