import { v4 as uuid } from "uuid";

export const formatIncommingTranscript = (
  noteData,
  noteID,
  fullTranscript,
  newCaption
) => {
  /**
   * This formats incoming transcript for Premium users because speaker idetificaition
   *
   * 1. Combines both non updating transcripts into an array
   * 2. Finds the last break point, and maxspeaker (This is important for nonconcurrent sessions from pause play intervals)
   * 3. Loops through newest transcript update,
   *    A. If the record does not match the previos one
   *        Find if that speaker instance exsits
   *        Else create new one
   *    B. Add new caption to the back of the old caption
   *
   */
  let json_transcript, pause_array, play_array;
  try {
    const matchingNote = noteData.find((note) => note.note_id === noteID);
    if (matchingNote) {
      ({ json_transcript, pause_array, play_array } = matchingNote);
    } else {
      console.error(`No note found with ID ${noteID}`);
    }
  } catch (err) {
    console.error(err);
  }

  const transcript = [...json_transcript, ...fullTranscript];
  console.log("full transcript", fullTranscript);

  let updatedSpeakerCount = 0;

  if (transcript.length > 0) {
    const breakList = transcript.filter((obj) => obj.break === true);
    //console.log("transcript", transcript, "\n", "breakList", breakList);
    if (breakList.length) {
      updatedSpeakerCount = breakList[breakList.length - 1].maxSpeaker;
    }
  }

  const timeToAdd = calcTotTime(play_array, pause_array);

  try {
    const Caption = newCaption.reduce((result, word, index) => {
      const { speaker, punctuated_word, word: plainWord, start } = word;

      const caption_in = punctuated_word ?? plainWord;

      const newSpeaker = speaker + updatedSpeakerCount;

      if (index === 0 || newSpeaker !== result[result.length - 1].speaker) {
        // this is going to be pushing no matter what

        //does this speaker appear before
        const record = transcript.find(
          (caption) => caption.speaker === newSpeaker
        );

        //if record exists push
        if (record) {
          const { name, id } = record;
          const add_new = {
            speaker: newSpeaker,
            caption: caption_in,
            id,
            name,
            break: false,
            time: start + timeToAdd,
          };
          result.push(add_new);
        } else {
          // create a new list item if it doesn't
          const id = uuid();
          result.push({
            speaker: newSpeaker,
            caption: caption_in,
            id,
            name: null,
            break: false,
            time: start + timeToAdd,
          });
        }
      } else {
        result[result.length - 1].caption += " " + caption_in;
      }
      return result;
    }, []);
    return Caption;
  } catch (err) {
    console.error("there is an error here", err);
  }
};

export const calcTotTime = (playArray, pauseArray) => {
  let totTime = 0;

  //this should loop for the lenth of pause array
  if (pauseArray) {
    for (let i = 0; i < pauseArray.length; i++) {
      let timeDiferential =
        new Date(pauseArray[i]).getTime() - new Date(playArray[i]).getTime();
      totTime += timeDiferential;
    }
  }
  return totTime;
};
