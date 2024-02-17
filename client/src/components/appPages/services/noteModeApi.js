export const createNewNote = (
  name,
  transcript,
  noteData,
  setNotes,
  setMode,
  wsJSON,
  session,
  SpeechRecognition
) => {
  //turn on the mike
  SpeechRecognition.startListening({ continuous: true });

  console.log(name);
  //notes are being deactivated in the backend so could just fetch insted of filter after send responce
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
    token: session.access_token,
  });
};
