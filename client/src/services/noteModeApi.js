export const createNewNote = (
  name,
  transcript,
  noteData,
  setNotes,
  setMode,
  wsJSON,
  setNoteName
) => {
  console.log(name);
  const noteMatch = noteData.filter((record) => {
    return record.title === name;
  });
  if (noteMatch.length === 0) {
    const statusUpdate = noteData.map((record) => {
      return { ...record, status: "inactive" };
    });
    setNotes(statusUpdate);
  }
  setMode("note");
  wsJSON({
    title: name,
    transcript: transcript,
    init: true,
  });

  setNoteName(name);
};
