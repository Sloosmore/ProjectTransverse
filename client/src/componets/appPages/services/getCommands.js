import { createNewNote } from "./noteModeApi";
//import { tvrseFunc } from "./tverseAPI";
//import { handleOnMessage } from "./wsResponce";

export const getCommands = (
  resetTranscript,
  transcript,
  setDocs,
  noteData,
  setNotes,
  setMode,
  wsJSON,
  setShowHelpModal
) => {
  return [
    {
      command: "kill",
      callback: () => {
        window.location.replace("https://www.google.com");
      },
    },
    {
      command: "transverse",
      callback: () => {
        tvrseFunc(transcript, setDocs);
        resetTranscript();
      },
    },
    {
      command: "go to *",
      callback: (route) => {
        /*fetch(`/route-api`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ route }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw Error(
                    `Server returned ${response.status}: ${response.statusText}`
                  );
                }
                const { resetTranscript } = useSpeechRecognition();
                const route = response.body["task_id"];
              })
              .catch((err) => {
                console.log(err);
              });*/
      },
    },
    {
      command: "* note mode",
      callback: (name) => {
        resetTranscript();
        createNewNote(name, transcript, noteData, setNotes, setMode, wsJSON);
      },
    },
    {
      command: "default mode",
      callback: () => {
        resetTranscript();
        const deactiveNotes = noteData.map((record) => {
          return { ...record, status: "inactive" };
        });
        setNotes(deactiveNotes);
        setMode("default");
      },
    },
    {
      command: "clear",
      callback: () => resetTranscript(),
    },
    {
      command: "help",
      callback: () => {
        resetTranscript();
        setShowHelpModal(true);
      },
    },
    {
      command: "exit",
      callback: () => {
        resetTranscript();
        setShowHelpModal(false);
      },
    },
    {
      command: "* note insturctions",
      callback: (instructions) => {
        resetTranscript();
        handleSendLLM(instructions);
      },
    },
  ];
};
