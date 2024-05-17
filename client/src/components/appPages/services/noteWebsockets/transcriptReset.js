import { appendFullTranscript } from "@/api/crud/notes/updateTranscript";

export const resetSaveTranscript = async (
  updatedTranscript,
  userType,
  resetTranscript,
  setFullTranscript,
  setNotes,
  noteID
) => {
  const transcriptType =
    userType === "Standard" ? "full_transcript" : "json_transcript";

  //that way if notes are pulled results are the same
  const fullTs = await appendFullTranscript(noteID, updatedTranscript);

  if (userType === "Standard") {
    resetTranscript();
  } else {
    setFullTranscript([]);
  }
  setNotes((prevNotes) =>
    prevNotes.map((record) =>
      record.note_id === noteID
        ? { ...record, [transcriptType]: fullTs }
        : record
    )
  );

  console.log("the notes should be updated", fullTs);
};
