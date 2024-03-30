import { v4 as uuidv4 } from "uuid";

export const createNewNote = (
  name,
  transcript,
  noteData,
  setNotes,
  setMode,
  wsJSON,
  session,
  folder_id,
  setNoteID
) => {
  //turn on the mike

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
  console.log("folder_id", folder_id);
  //this may be blocking
  const noteID = uuidv4();
  setNoteID(noteID);

  setMode("note");
  wsJSON({
    title: name,
    transcript: transcript,
    init: true,
    token: session.access_token,
    folder_id: folder_id,
    note_id: noteID,
  });
};
