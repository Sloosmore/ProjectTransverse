const titleFromID = (ID, noteRecords) => {
  if (ID && noteRecords) {
    const record = noteRecords.find((record) => ID === record.note_id);
    const title = record ? record.title : undefined;
    return title;
  } else if (noteRecords) {
    console.log("ID is note present: ", ID);
  } else if (ID) {
    console.log("noteRecords is not present: ", noteRecords);
  }
};

export default titleFromID;
