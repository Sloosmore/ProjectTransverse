export const onPause = async (id) => {
  //turn off the mike
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-pause`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );
  const data = await response.json();
  console.log(data);
};

export const onPlay = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-play`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );
  const data = await response.json();
  console.log(data);
};
