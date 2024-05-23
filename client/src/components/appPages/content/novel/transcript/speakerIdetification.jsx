import { formatElapsedTime } from "@/components/appPages/services/transcriptFormating/formatTime";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { TranscriptContext } from "@/hooks/noteHooks/transcriptStore";
import { useContext } from "react";
import { supabaseClient } from "@/config/supabaseClient";
import { useDebouncedCallback } from "use-debounce";

const SpeakerCaption = ({ speak }) => {
  const { fullTranscript, setFullTranscript, caption, setCaption } =
    useContext(TranscriptContext);
  const { noteData, setNotes, noteID } = useNoteData();
  const { caption: text, id, name, time, speaker } = speak;

  const saveName = async (saveNote) => {
    const { note_id, json_transcript } = saveNote;
    const result = await supabaseClient
      .from("note")
      .update({ json_transcript, date_updated: new Date() })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
  };

  const debouncedCallback = useDebouncedCallback((saveNote) => {
    saveName(saveNote);
  }, 300);

  const updateNames = (e) => {
    const newName = e.target.value;

    //map through full ts first

    setNotes((prev) => {
      return prev.map((note) => {
        if (noteID === note.note_id) {
          note.json_transcript = note.json_transcript.map((obj) =>
            obj.id === id ? { ...obj, name: newName } : obj
          );
        }
        return note;
      });
    });

    if (Array.isArray(fullTranscript) && fullTranscript.length > 0) {
      setFullTranscript((list) =>
        list.map((obj) => (obj.id === id ? { ...obj, name: newName } : obj))
      );
    }
    if (Array.isArray(caption) && caption.length > 0) {
      setCaption((list) =>
        list.map((obj) => (obj.id === id ? { ...obj, name: newName } : obj))
      );
    }

    const saveNote = noteData.find((note) => noteID === note.note_id);
    saveNote.json_transcript.map((obj) =>
      obj.id === id ? { ...obj, name: newName } : obj
    );

    debouncedCallback(saveNote);

    const mirrorDiv = document.getElementById("mirrorDiv");
    const inputField = document.getElementById("inputField");
    inputField.style.width = `${mirrorDiv.clientWidth}px`;
  };

  return (
    <div className="flex flex-row my-[2em]">
      <img
        src={`https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=${id}`}
        alt=""
        className="h-[2.2em] w-[2.2em] mt-1 p-.5 border rounded-full me-4"
      />
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div id="mirrorDiv" style={{ display: "none" }}>
            {name}
          </div>
          <input
            value={name || undefined}
            onChange={updateNames}
            placeholder={`Speaker ${speaker}`}
            className=" font-semibold bg-transparent overflow-ellipsis overflow-hidden	focus:outline-none"
          />
          <div
            className="ms-2 my-auto "
            style={{ fontSize: ".7em", opacity: ".6" }}
          >
            {formatElapsedTime(time * 1000)}
          </div>
        </div>
        <p className="">{text}</p>
      </div>
    </div>
  );
};

export default SpeakerCaption;

/*

if there is a change to caption 

find all others with ID matching
Set the names to be the same 

--> something to play with in the future
if the name matches the other name 
set all names to be the same

*/
