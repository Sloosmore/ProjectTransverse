const getRecStatusArray = ({
  onPause,
  onPlay,
  noteID,
  fetchNoteRecords,
  session,
  setNotes,
  setMode,
  endNoteToast,
  SpeechRecognition,
  setNoteID,
  localNoteID,
}) => [
  {
    recStatus: "pause",
    leftFunction: () => {
      onPause(noteID)
        .then(() => fetchNoteRecords(session, true))
        .then((data) => {
          setNotes(data);
          setMode("default");
        });
    },
    rightFunction: () => {
      onPause(noteID)
        .then(() => fetchNoteRecords(session, true))
        .then((data) => {
          setNotes(data);
          setMode("default");
        });
      setNoteID(null);
      endNoteToast();
    },
    leftIcon: "bi bi-pause-fill bi-2x align-left",
    rightIcon: "bi bi-square-fill ",
  },
  {
    recStatus: "play",
    leftFunction: () => {
      onPlay(noteID)
        .then(() => fetchNoteRecords(session, true, true))
        .then((data) => setNotes(data));
      setMode("note");
      SpeechRecognition.startListening({ continuous: true });
    },
    rightFunction: () => {
      setNoteID();
      endNoteToast();
    },
    leftIcon: "bi bi-record2 bi-2x align-left",
    rightIcon: "bi bi-square-fill ",
  },
  {
    recStatus: "unlock",
    leftFunction: () => {
      setNoteID(localNoteID);
      onPlay(localNoteID)
        .then(() => fetchNoteRecords(session, true, true))
        .then((data) => setNotes(data));
      setMode("note");
      SpeechRecognition.startListening({ continuous: true });
    },
    rightFunction: () => {
      setNoteID();
    },
    leftIcon: "bi bi-record2 bi-2x align-left ",
    rightIcon: "bi bi-square-fill ",
  },
  {
    recStatus: "lock",
    leftFunction: null,
    rightFunction: null,
    leftIcon: "bi bi-record2 bi-2x align-left ",
    rightIcon: "bi bi-square-fill ",
  },
];

export default getRecStatusArray;
