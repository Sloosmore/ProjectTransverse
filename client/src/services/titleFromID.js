const titleFromID = (ID, noteRecords) => {
    const record = noteRecords.find((record) => ID === record.note_id);
    const title = record ? record.title : undefined;
    return title
}

export default titleFromID