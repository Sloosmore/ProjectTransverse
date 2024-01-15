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
