export const onPause = async (id) => {
  const response = await fetch("/records-api/notes-pause", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  console.log(data);
};

export const onPlay = async (id) => {
  const response = await fetch("/records-api/notes-play", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  console.log(data);
};
