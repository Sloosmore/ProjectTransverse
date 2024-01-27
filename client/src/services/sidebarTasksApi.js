export const fetchTaskRecords = async () => {
  const response = await fetch("/records-api/tasks", { method: "GET" });
  const data = await response.json();
  return data.records;
};

export const fetchNoteRecords = async () => {
  const response = await fetch("/records-api/notes", { method: "GET" });
  const data = await response.json();
  return data.noteRecords;
};

export const saveNoteRecord = async (id, markdown) => {
  const response = await fetch("/records-api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': 'Bearer ' + token // Uncomment this line if you need to send a token
    },
    body: JSON.stringify({ id, markdown }),
  });
  const data = await response.json();
  console.log(data);
};
