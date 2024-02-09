const uuid = require("uuid");
const { queryAI } = require("../middleware/wsNotes/gptMD");
const pool = require("../db/db");
const { appendFullTranscript } = require("../middleware/wsNotes/appendFullTs");
const fsPromises = require("fs").promises;
const path = require("path");
const {
  fetchActiveTs,
  clearActiveTS,
} = require("../middleware/wsNotes/activeTs");
const { deactivateRecords } = require("../middleware/wsNotes/deactivateNotes");
const supabase = require("../db/supabase");
const { getUserIdFromToken } = require("../middleware/authDecodeJWS");

async function handleWebSocketConnection(ws, request) {
  const connectMessage = {
    message: "Connected to WebSocket!",
  };
  const threshold = 500;
  ws.send(JSON.stringify(connectMessage));

  //Append note record to db

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      const title = data.title;
      const ts = data.transcript;
      const justActivated = data.init;
      console.log(`this is the incomming transcript ${ts}`);

      //this is loosmore's user ID
      const token = data.token;
      const user =
        getUserIdFromToken(token) || "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

      if (justActivated) {
        const user_id = user;

        const note_id = uuid.v4();
        const status = "active";
        const is_deleted = false;
        const thread_id = "";

        const active_transcript = "";
        const full_transcript = "";
        const active_markdown = "";
        const full_markdown = "";
        const visible = "true";
        //this may not be needed... but need to make sure that this happens before play does
        const play_timestamps = [new Date()];
        const pause_timestamps = [];

        const newRecQuery =
          "INSERT INTO note(note_id, user_id, title, status, date_created, date_updated, is_deleted, active_transcript, full_transcript, active_markdown, full_markdown, thread_id, visible, play_timestamps, pause_timestamps) VALUES($1, $2, $3, $4, NOW(), NOW(), $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *";
        const newRec = [
          note_id,
          user_id,
          title,
          status,
          is_deleted,
          active_transcript,
          full_transcript,
          active_markdown,
          full_markdown,
          thread_id,
          visible,
          play_timestamps,
          pause_timestamps,
        ];

        try {
          //deactivate records

          const inactiveRecords = await deactivateRecords(user);

          //send new record
          const { data: record, error: insertError } = await supabase
            .from("note")
            .insert({
              note_id,
              user_id,
              title,
              status,
              date_created: new Date(),
              date_updated: new Date(),
              is_deleted,
              active_transcript,
              full_transcript,
              active_markdown,
              full_markdown,
              thread_id,
              visible,
              play_timestamps,
              pause_timestamps,
            })
            .select();

          if (insertError) {
            throw insertError;
          }

          // send returned records from DB so frontend can set the notes

          ws.send(
            JSON.stringify({
              noteRecords: [record[0], ...inactiveRecords],
              note_id,
            })
          );
        } catch (err) {
          console.error(`the error is happening at record ${err}`);
        }
      } else if (ts) {
        //get the id of the note which will only be passed when note is Activated
        const note_id = data.note_id;

        //this is what needs to be appended to the full TS and thrown on to the active to see if it needs to be appended
        //throw on a date if it has a x charecter count
        let incomingTs = 0;
        if (ts.length > 40) {
          //READ FROM DB HERE
          // if playarray > pause array we are in play
          // if pauseArray = play array we are in paus

          const { data: latestDate, error } = await supabase
            .from("note")
            .select("play_timestamps, pause_timestamps")
            .eq("note_id", note_id);

          if (error) {
            throw error;
          }

          if (latestDate.length === 0) {
            // Handle the case where no data is found
            console.error("No data found for the given note_id.");
            return;
          }

          const playArray = latestDate[0].play_timestamps;
          const pauseArray = latestDate[0].pause_timestamps;

          let totTime = 0;

          for (let i = 0; i < pauseArray.length; i++) {
            let timeDiferential =
              new Date(pauseArray[i]).getTime() -
              new Date(playArray[i]).getTime();
            totTime += timeDiferential;
            console.log(totTime);
          }
          //if in play mode (most of the time)
          if (pauseArray.length < playArray.length) {
            const lastIndex = playArray.length - 1;
            const lastDate = new Date(playArray[lastIndex]);
            const date = new Date();
            const mostUpdate = date.getTime() - lastDate.getTime();
            totTime += mostUpdate;
            console.log(totTime);
          }

          let hours = Math.floor(totTime / 3600000);
          let minutes = Math.floor((totTime % 3600000) / 60000);
          let seconds = Math.floor(((totTime % 3600000) % 60000) / 1000);

          // Pad the minutes and seconds with leading zeros, if necessary
          minutes = minutes.toString().padStart(2, "0");
          seconds = seconds.toString().padStart(2, "0");

          let formattedTime = `${minutes}:${seconds}`;
          // If hours is not zero, prepend it to the formatted time
          if (hours > 0) {
            hours = hours.toString().padStart(2, "0");
            formattedTime = `${hours}:${formattedTime}`;
          }

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

        if (activeTs && activeTs.length >= threshold) {
          //in theroy the thread ID should be passed into this function

          const res = await queryAI(note_id, activeTs);

          //be able to look at outputs without clouding consol
          const debugPath = path.join(__dirname, "../logs/debuglog.txt");
          await fsPromises.appendFile(debugPath, JSON.stringify(res, null, 2));
          //console.log(`AI ${JSON.stringify(res, null, 2)}`);
          const md = res["data"][0]["content"][0]["text"]["value"];

          console.log(`there is new markdown
          
          ${md}`);

          //clear active transcript so it can be used later
          const clearTSBool = await clearActiveTS(note_id);

          const { data: fullMdResult, error } = await supabase
            .from("note")
            .select("full_markdown")
            .eq("note_id", note_id);

          if (error) {
            throw error;
          }

          let fullMd = fullMdResult[0].full_markdown;
          fullMd += "\n" + md;

          ws.send(
            JSON.stringify({
              md: fullMd,
            })
          );
        } else if (activeTs) {
          console.log(
            `Pooling TS => ${
              (activeTs.length / threshold) * 100
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
