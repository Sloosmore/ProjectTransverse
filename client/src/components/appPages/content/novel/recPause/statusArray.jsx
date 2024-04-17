const getRecStatusArray = ({
  onPause,
  onPlay,
  noteID,
  setMode,
  setNoteID,
  localNoteID,
}) => [
  {
    recStatus: "pause",
    leftFunction: () => {
      const date = new Date();
      setMode("default");
      onPause(noteID, date);
      //the mode is default so the recording will stop and fetch the notes
      //uploading note data
    },
    rightFunction: () => {
      const date = new Date();
      setMode("default");
      onPause(noteID, date);
      setNoteID(null);
    },
    leftIcon: "bi bi-pause-fill bi-2x align-left",
    rightIcon: "bi bi-square-fill ",
  },
  {
    recStatus: "play",
    leftFunction: () => {
      setMode("note");
      onPlay(noteID);
    },
    rightFunction: () => {
      setNoteID();
    },
    leftIcon: "bi bi-mic-fill bi-2x align-left",
    rightIcon: "bi bi-square-fill ",
  },
  {
    recStatus: "unlock",
    leftFunction: () => {
      setNoteID(localNoteID);
      onPlay(localNoteID);
      setMode("note");
    },
    rightFunction: () => {
      setNoteID();
    },
    leftIcon: "bi bi-mic-fill bi-2x align-left ",
    rightIcon: "bi bi-square-fill ",
  },
  {
    recStatus: "lock",
    leftFunction: () => {
      console.log("locked");
    },
    rightFunction: () => {
      console.log("locked");
    },
    leftIcon: "bi bi-lock-fill bi-2x align-left ",
    rightIcon: "bi bi-square-fill ",
  },
];

export default getRecStatusArray;
