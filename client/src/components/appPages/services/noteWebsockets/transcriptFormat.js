import { formatElapsedTime } from "../transcriptFormating/formatTime";

export const StandardFormating = async (noteID, setFullTranscript) => {
  const totTime = await calculateTotTime(noteID);

  const formattedTime = formatElapsedTime(totTime);

  setFullTranscript((prev) => `${prev} \n\n ${formattedTime}\n`);
};

/*

  if (wsData.resetState) {
    if (userType === "Standard") {
      resetTranscript();
    } else {
      setFullTranscript([]);
    }

    const upDataNotes = noteData.map((record) => {
      if (record.note_id === noteID) {
        const in_ts = wsData.transcript;
        console.log("heyyyyy the ts is back here it is", in_ts);
        record.full_transcript = in_ts;
      }
      return record;
    });
    setNotes(upDataNotes);
  }

  */
