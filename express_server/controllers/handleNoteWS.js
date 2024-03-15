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
const {
  markdownToTiptap,
  combineTiptapObjects,
} = require("../middleware/wsNotes/md2JSON");

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

      const title = data.title;
      const ts = data.transcript;
      const justActivated = data.init;
      //console.log(`this is the incomming transcript ${ts}`);

      //this is loosmore's user ID
      const token = data.token;
      const user =
        getUserIdFromToken(token) || "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

      if (justActivated) {
        console.log("data", data);

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
        const json_content = "";
        const folder_id = data.folder_id;

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
          //grabs all the notes and not just the ones that are deleted
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
              full_markdown,
              thread_id,
              visible,
              play_timestamps,
              pause_timestamps,
              json_content,
              folder_id,
            })
            .select();

          if (insertError) {
            throw insertError;
          }

          // send returned records from DB so frontend can set the notes
          console.log(record[0]);

          //create audio_segment
          const segment_id = uuid.v4();
          const file_path = `${note_id}/01`;
          try {
            const { data: audioSegment, error: audioError } = await supabase
              .from("audio_segment")
              .insert({
                segment_id,
                note_id,
                sequence_num: 1,
                file_path,
              });
          } catch (error) {
            console.error("Error in audio segment creation:", error);
          }

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
          console.log("playArray", playArray);
          console.log("pauseArray", pauseArray);

          let totTime = 0;

          //this should loop for the lenth of pause array
          for (let i = 0; i < pauseArray.length; i++) {
            let timeDiferential =
              new Date(pauseArray[i]).getTime() -
              new Date(playArray[i]).getTime();
            totTime += timeDiferential;
            console.log("Step ", i, "Time", totTime);
          }

          //if in play mode (most of the time)
          if (pauseArray.length < playArray.length) {
            const lastIndex = playArray.length - 1;
            console.log(playArray[lastIndex]);
            let lastDate = new Date(playArray[lastIndex]);

            const timezoneOffsetMilliseconds =
              new Date().getTimezoneOffset() * 60 * 1000;

            // Subtract the timezone offset from lastDate
            lastDate = new Date(
              lastDate.getTime() - timezoneOffsetMilliseconds
            );

            const now = new Date();

            console.log("lastDate ", lastDate, "date", now);
            const mostUpdate = now.getTime() - lastDate.getTime();

            totTime += mostUpdate;
            console.log(totTime);
          }

          let hours = Math.floor(totTime / 3600000);
          let minutes = Math.floor((totTime % 3600000) / 60000);
          let seconds = Math.floor(((totTime % 3600000) % 60000) / 1000);

          // Pad the minutes and seconds with leading zeros, if necessary
          minutes = minutes.toString().padStart(2, "0");
          seconds = seconds.toString().padStart(2, "0");

          if (seconds % 10 === 0) {
            seconds = seconds.padEnd(2, "0");
          }

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

        const { data: message, error } = await supabase
          .from("user")
          .select("note_frequency")
          .eq("user_id", user);

        const frequency = message[0].note_frequency || 700;

        if (error) {
          throw error;
        }

        if (activeTs && activeTs.length >= frequency) {
          //in theroy the thread ID should be passed into this function

          const res = await queryAI(note_id, activeTs);

          //be able to look at outputs without clouding consol
          const debugPath = path.join(__dirname, "../logs/debuglog.txt");
          await fsPromises.appendFile(debugPath, JSON.stringify(res, null, 2));
          //console.log(`AI ${JSON.stringify(res, null, 2)}`);
          const md = res["data"][0]["content"][0]["text"]["value"];

          //convert markdown into json
          const mdJSON = await markdownToTiptap(md);

          //clear active transcript so it can be used later
          const clearTSBool = await clearActiveTS(note_id);

          const { data: fullMdResult, error } = await supabase
            .from("note")
            .select("full_markdown, json_content")
            .eq("note_id", note_id);

          if (error) {
            throw error;
          }

          let fullMd = fullMdResult[0].full_markdown;
          fullMd += "\n" + md;

          const jsonContent = fullMdResult[0].json_content;
          const combinedJSON = combineTiptapObjects(jsonContent, mdJSON);
          console.log(`combinedJSON`, combinedJSON);
          ws.send(
            JSON.stringify({
              md: fullMd,
              json_content: combinedJSON,
            })
          );
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
