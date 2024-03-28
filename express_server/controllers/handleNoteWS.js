const uuid = require("uuid");
const { queryAI } = require("../middleware/wsNotes/gptMD");
const pool = require("../db/db");
const {
  appendFullTranscript,
} = require("../middleware/wsNotes/databaseOps/appendFullTs");
const fsPromises = require("fs").promises;
const path = require("path");
const {
  fetchActiveTs,
  clearActiveTS,
} = require("../middleware/wsNotes/databaseOps/activeTs");
const {
  deactivateRecords,
} = require("../middleware/wsNotes/databaseOps/deactivateNotes");
const supabase = require("../db/supabase");
const { getUserIdFromToken } = require("../middleware/authDecodeJWS");
const {
  markdownToTiptap,
  combineTiptapObjects,
} = require("../middleware/wsNotes/compileGPTOutput/md2JSON");

const {
  insertNewNoteRecord,
  insertNewAudioSegment,
} = require("../middleware/wsNotes/insertNewNote");
const { formatElapsedTime } = require("../middleware/wsNotes/formating");
const { calculateTotTime } = require("../middleware/infoTracking/calcTime");

async function handleWebSocketConnection(ws, request) {
  const connectMessage = {
    message: "Connected to WebSocket!",
  };
  ws.send(JSON.stringify(connectMessage));

  //Append note record to db

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.ping === true) {
        ws.send(JSON.stringify({ pong: true }));
        return;
      }

      const ts = data.transcript;
      const justActivated = data.init;
      //console.log(`this is the incomming transcript ${ts}`);

      //this is loosmore's user ID
      const token = data.token;
      const user = getUserIdFromToken(token);

      if (justActivated) {
        //extenal data: data.folder_id, user, title,
        console.log("data", data);
        const user_id = user;
        const title = data.title;
        const folder_id = data.folder_id;

        const inactiveRecords = await deactivateRecords(user);
        const record = await insertNewNoteRecord(user_id, title, folder_id);
        console.log(record[0]);
        const note_id = record[0].note_id;
        const audioSegment = await insertNewAudioSegment(note_id);

        ws.send(
          JSON.stringify({
            noteRecords: [record[0], ...inactiveRecords],
            note_id,
          })
        );
      } else if (ts) {
        //get the id of the note which will only be passed when note is Activated
        const note_id = data.note_id;
        console.log("note_id in ws", note_id);

        //this is what needs to be appended to the full TS and thrown on to the active to see if it needs to be appended
        //throw on a date if it has a x charecter count
        let incomingTs = 0;
        if (ts.length > 40) {
          //READ FROM DB HERE
          // if playarray > pause array we are in play
          // if pauseArray = play array we are in paus

          const totTime = await calculateTotTime(note_id);

          const formattedTime = formatElapsedTime(totTime);

          incomingTs = `${ts} \n\n ${formattedTime}\n`;
        } else {
          incomingTs = ts;
        }
        //this is what I need to check out
        const newFullTs = await appendFullTranscript(note_id, incomingTs);

        //send timestamped transcript
        if (newFullTs) {
          ws.send(
            JSON.stringify({
              resetState: true,
              transcript: newFullTs,
            })
          );
        }

        //now lets get the active TS to see if it meets the transcription threshold
        const activeTs = await fetchActiveTs(note_id, incomingTs);

        //only pass the new ts to the AI query when the transcript gets reset it needs to pass the thresehold which it probaly should

        const { data: message, error } = await supabase
          .from("user")
          .select("note_frequency")
          .eq("user_id", user);

        const frequency = message[0].note_frequency || 700;

        if (error) {
          throw error;
        }

        console.log("frequncy", frequency);
        if (activeTs && activeTs.length >= frequency) {
          //in theroy the thread ID should be passed into this function
          const md = await queryAI(note_id, activeTs, frequency);

          //const debugPath = path.join(__dirname, "../logs/debuglog.txt");
          //await fsPromises.appendFile(debugPath, JSON.stringify(res, null, 2));
          //console.log(`AI ${JSON.stringify(res, null, 2)}`);

          //convert markdown into json
          //md will be null if the AI call fails or are turned off
          if (md) {
            //mdJSON includes type: "doc", content is just content
            const { fullDoc, contentLevel } = await markdownToTiptap(
              md,
              totTime
            );

            //clear active transcript so it can be used later
            const clearTSBool = await clearActiveTS(note_id);

            const { data: fullMdResult, error } = await supabase
              .from("note")
              .select("full_markdown, json_content")
              .eq("note_id", note_id);

            if (error) {
              throw error;
            }

            console.log("fullMdResult", fullMdResult);

            let fullMd = fullMdResult[0].full_markdown;
            fullMd += "\n" + md;

            const jsonContent = fullMdResult[0].json_content;
            const combinedJSON = combineTiptapObjects(jsonContent, fullDoc);
            console.log(`combinedJSON`, combinedJSON);
            ws.send(
              JSON.stringify({
                md: fullMd,
                json_content: combinedJSON,
                new_json: contentLevel,
              })
            );
          }
        } else if (activeTs) {
          console.log(
            `Pooling TS => ${
              (activeTs.length / frequency) * 100
            }% of the way to next note
            ${activeTs}`
          );
        } else if (activeTs === false)
          console.log("fetch ts function may not be working");
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }
  });
}

module.exports = { handleWebSocketConnection };
/*
Timestamp Inclusion: Right before each new topic heading, it is imperative to include the timestamp from the transcript indicating when this topic started. This should not be part of the title, but directly below it. Format it as 00:00 with the first two zeros being minutes and the second two being seconds. Add hours as a single digit in front of minutes like 0:00:00 as needed. The notes will not be sufficient if each section does not contain a timestamp. IF YOU FIND MULTIPLE TOPICS within a single timestamp span, format everything under one '## topic,' then break into sub-topics inside that topic. Ensure this timestamp accurately reflects the point in the lecture where the new topic begins. Always put time stamps below each top title. 
*/
