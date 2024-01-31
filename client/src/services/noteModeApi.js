export const createNewNote = (
  name,
  transcript,
  noteData,
  setNotes,
  setMode,
  wsJSON
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
  //this may be blocking
  setMode("note");
  wsJSON({
    title: name,
    transcript: transcript,
    init: true,
  });
};
