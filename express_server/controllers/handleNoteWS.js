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

async function handleWebSocketConnection(ws, request) {
  const connectMessage = {
    message: "Connected to WebSocket!",
  };
  const threshold = 750;
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
      const user = data.user || "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

      if (justActivated) {
        const user_id = user;

        const inactiveQuery =
          "UPDATE note SET status = $1, date_updated = NOW() WHERE user_id = $2 RETURNING *";
        const inactiveValues = ["inactive", user_id];

        const note_id = uuid.v4();
        const status = "active";
        const is_deleted = false;
        const thread_id = "";

        const date_created = new Date();
        const date_updated = new Date();

        const active_transcript = "";
        const full_transcript = "";
        const active_markdown = "";
        const full_markdown = "";
        const visable = "true";

        const newRecQuery =
          "INSERT INTO note(note_id, user_id, title, status, date_created, date_updated, is_deleted, active_transcript, full_transcript, active_markdown, full_markdown, thread_id, visible) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *";
        const newRec = [
          note_id,
          user_id,
          title,
          status,
          date_created,
          date_updated,
          is_deleted,
          active_transcript,
          full_transcript,
          active_markdown,
          full_markdown,
          thread_id,
          visable,
        ];

        try {
          //deactivate records
          const { rows: inactiveRows } = await pool.query(
            inactiveQuery,
            inactiveValues
          );
          const inactiveRecords = inactiveRows;

          //send new record
          const { rows: newRecRows } = await pool.query(newRecQuery, newRec);
          const record = newRecRows[0];

          // send returned records from DB so frontend can set the notes
          ws.send(
            JSON.stringify({
              noteRecords: [record, ...inactiveRecords],
              note_id,
            })
          );
        } catch (err) {
          console.error(err);
        }
      } else if (ts) {
        //get the id of the note which will only be passed when note is Activated
        const id = data.note_id;

        //this is what needs to be appended to the full TS and thrown on to the active to see if it needs to be appended
        //throw on a date if it has a x charecter count
        let incomingTs;
        if (ts.length > 40) {
          const date = new Date();
          incomingTs = `${ts} \n\n ${date.toISOString()}`;
        } else {
          incomingTs = ts;
        }

        const newFullTs = await appendFullTranscript(id, incomingTs);

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
        const activeTs = await fetchActiveTs(id, incomingTs);

        //only pass the new ts to the AI query when the transcript gets reset it needs to pass the thresehold which it probaly should

        if (activeTs && activeTs.length >= threshold) {
          //in theroy the thread ID should be passed into this function

          const res = await queryAI(id, activeTs);

          //be able to look at outputs without clouding consol
          const debugPath = path.join(__dirname, "../logs/debuglog.txt");
          await fsPromises.appendFile(debugPath, JSON.stringify(res, null, 2));
          //console.log(`AI ${JSON.stringify(res, null, 2)}`);
          const md = res["data"][0]["content"][0]["text"]["value"];

          console.log(`there is new markdown
          
          ${md}`);

          //clear active transcript so it can be used later
          const clearTSBool = await clearActiveTS(id);

          const fullMDQuery =
            "SELECT full_markdown FROM note WHERE note_id = $1";
          const mdParams = [id];

          let result = await pool.query(fullMDQuery, mdParams);
          let fullMd = result.rows[0].full_markdown;
          fullMd += md;

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
