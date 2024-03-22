export const toggleGen = async (note_id, note_toggle, diagram_toggle) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-toggleGen`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id,
        diagram_gen_on: diagram_toggle,
        note_gen_on: note_toggle,
      }),
    }
  );
  const data = await response.json();
  return data.noteRecords;
};
