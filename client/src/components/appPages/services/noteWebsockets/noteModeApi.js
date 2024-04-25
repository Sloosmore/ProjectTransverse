import { v4 as uuidv4 } from "uuid";
import insertNewNoteRecord from "./insertNoteTable";
import { fetchNoteRecords } from "../crudApi";
import insertNewAudioSegment from "./insertAudioSeg";

export const createNewNote = async (
  name,
  setMode,
  session,
  folder_id,
  setNoteID,
  navigate
) => {
  //turn on the mike

  //this may be blocking
  const noteID = uuidv4();
  setNoteID(noteID);

  const record = await insertNewNoteRecord({
    user_id: session.user.id,
    title: name,
    folder_id: folder_id,
    note_id: noteID,
  });
  await fetchNoteRecords(session, false);
  await insertNewAudioSegment(noteID);

  navigate(`/app/n/${noteID}`);
  setMode("note");
};

/* wsJSON({
  title: name,
  transcript: transcript,
  init: true,
  token: session.access_token,
  folder_id: folder_id,
  note_id: noteID,
});*/
