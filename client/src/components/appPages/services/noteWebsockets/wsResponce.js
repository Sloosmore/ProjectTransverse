import { saveNoteMarkdown } from "@/api/crud/notes/updateNoteContent";
//this takes two params note ID and markdown

export const handleOnMessage = (
  event,
  noteData,
  setNotes,
  noteID,
  navigate
) => {
  const wsData = JSON.parse(event.data);
  console.log("WebSocket message received:", wsData);
  /*
  if (wsData.noteRecords) {
    //this should happen once during notemode init
    console.log("-------======================================-------");
    //set by uuid
    const noteID = wsData.note_id;
    console.log("returned noteID", noteID);
    setNotes(wsData.noteRecords);
    navigate(`/app/n/${noteID}`);
  }*/

  if (wsData.md) {
    //find record and set markdown in that specific file
    //this will update the markdown of a specific record
    console.log("new_json", wsData.new_json);
    const updateMd = noteData.map((record) => {
      //append markdown here
      if (record.note_id === noteID) {
        record.full_markdown = wsData.md;
        record.json_content = wsData.json_content;
        record.new_json = wsData.new_json;
        saveNoteMarkdown(
          record.note_id,
          record.full_markdown,
          record.json_content
        );
      }
      return record;
    });
    console.log("updateMd", updateMd);
    setNotes(updateMd);
  }
};
