import {
  startRecordingMedia,
  stopRecordingMedia,
} from "@/components/appPages/services/audio/mediaRecorder";

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
  recorder,
  setRecorder,
}) => [
  {
    recStatus: "pause",
    leftFunction: () => {
      const date = new Date();
      setMode("default");
      //uploading note data
      setTimeout(() => {
        onPause(noteID, date)
          .then(() => fetchNoteRecords(session, true))
          .then((data) => {
            setNotes(data);
            //will stop the recording because the mode is default
          });
      }, 1500);
    },
    rightFunction: () => {
      onPause(noteID)
        .then(() => fetchNoteRecords(session, true))
        .then((data) => {
          console.log("paused data", data);
          setNotes(data);
          setMode("default"); //will stop the recording because the mode is default
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
      startRecordingMedia(session, setRecorder, noteID);
      console.log("between start and speech");
      SpeechRecognition.startListening({ continuous: true });
    },
    rightFunction: () => {
      setNoteID();
      endNoteToast();
    },
    leftIcon: "bi bi-mic-fill bi-2x align-left",
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
      startRecordingMedia(session, setRecorder, localNoteID);
      console.log("between start and speech");
      SpeechRecognition.startListening({ continuous: true });
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
    leftIcon: "bi bi-mic-fill bi-2x align-left ",
    rightIcon: "bi bi-square-fill ",
  },
];

export default getRecStatusArray;
