import { saveNoteRecord } from "./sidebarTasksApi";
//this takes two params note ID and markdown

export const handleOnMessage = (
  event,
  noteData,
  setNoteID,
  setNotes,
  noteID,
  resetTranscript
) => {
  const wsData = JSON.parse(event.data);
  console.log("WebSocket message received:", wsData);
  if (wsData.noteRecords) {
    //this should happen once during notemode init
    console.log("-------======================================-------");
    //set by uuid
    setNoteID(wsData.note_id);
    setNotes(wsData.noteRecords);
  }
  if (wsData.resetState) {
    resetTranscript();
    const upDataNotes = noteData.map((record) => {
      if (record.note_id === noteID) {
        record.full_transcript = wsData.transcript;
      }
      return record;
    });
    setNotes(upDataNotes);
  }
  if (wsData.md) {
    //find record and set markdown in that specific file
    //this will update the markdown of a specific record
    const updateMd = noteData.map((record) => {
      //append markdown here
      if (record.note_id === noteID) {
        record.full_markdown = wsData.md;
        //saveNoteRecord(record.note_id, record.full_markdown);
      }
      return record;
    });
    setNotes(updateMd);
  }
};
