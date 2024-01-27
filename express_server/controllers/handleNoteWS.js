const uuid = require("uuid");
const { queryAI } = require("../middleware/wsNotes/gptMD");
const { pool } = require("../db/db");

async function handleWebSocketConnection(ws, request) {
  const connectMessage = {
    message: "Connected to WebSocket!",
  };
  ws.send(JSON.stringify(connectMessage));

  //Append note record to db

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      const title = data.title;
      const ts = data.transcript;
      const justActivated = data.init;

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

        const newRecQuery =
          "INSERT INTO note(note_id, user_id, title, status, date_created, date_updated, is_deleted, active_transcript, full_transcript, active_markdown, full_markdown, thread_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";
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
      } else {
        //do this every time:
        //turn this into a function that takes in transcript
        const id = data.note_id;

        let oldTS = "";
        const matchIDQueryFull =
          "Select full_transcript FROM note WHERE note_id = ($1)";
        const matchedRecordFull = [id];

        try {
          const res = await pool.query(matchIDQueryFull, matchedRecordFull);
          oldTS = res.rows[0].full_transcript;
        } catch (error) {
          console.error(`Error: ${error}`);
        }

        const date = new Date();
        const dateTs = `${ts} \n\n ${date.toISOString()}`;
        const newTS = oldTS + dateTs;

        const reWriteFTS =
          "UPDATE note SET full_transcript = $1 WHERE note_id = $2";
        const reWriteTSParam = [newTS, id];

        try {
          await pool.query(reWriteFTS, reWriteTSParam);
        } catch (err) {
          console.error(err);
        }

        //send timestamped transcript
        ws.send(
          JSON.stringify({
            resetState: true,
            transcript: newTS,
          })
        );

        let activeTS = "";
        const matchIDQueryActive =
          "Select active_transcript FROM note WHERE note_id = ($1)";
        const matchedRecordActive = [id];

        try {
          const res = await pool.query(matchIDQueryActive, matchedRecordActive);
          activeTS = res.rows[0].active_transcript;
          activeTS += dateTs;
        } catch (error) {
          console.error(`Error: ${error}`);
        }
        //only pass the new ts to the AI query when the transcript gets reset it needs to pass the thresehold which it probaly should
        if (activeTS.length >= 750) {
          //in theroy the thread ID should be passed into this function

          const res = await queryAI(activeTS);
          console.log(`AI ${JSON.stringify(res, null, 2)}`);
          const md = res["data"][0]["content"][0]["text"]["value"];
          //insted of updating the MD by adding will now send chuncks to the frontend

          const clear = "";
          const clearATS =
            "UPDATE note SET active_transcript = $1, date_updated = NOW() WHERE note_id = $2";
          const clearATSParam = [clear, id];

          try {
            await pool.query(clearATS, clearATSParam);
          } catch (err) {
            console.error(err);
          }

          ws.send(
            JSON.stringify({
              md: md,
            })
          );
        } else {
          const updateATS =
            "UPDATE note SET active_transcript = $1, date_updated = NOW() WHERE note_id = $2";
          const updateATSParam = [activeTS, id];

          try {
            await pool.query(updateATS, updateATSParam);
          } catch (err) {
            console.error(err);
          }
          //write to Active TS
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }
  });
}

module.exports = { handleWebSocketConnection };
