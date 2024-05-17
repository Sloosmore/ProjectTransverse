const { queryAI } = require("../middleware/wsNotes/gptMD");
const {
  appendFullTranscript,
} = require("../middleware/wsNotes/databaseOps/appendFullTs");
const path = require("path");
const {
  fetchActiveTs,
  clearActiveTS,
} = require("../middleware/wsNotes/databaseOps/activeTs");

const supabase = require("../db/supabase");
const { getUserIdFromToken } = require("../middleware/authDecodeJWS");
const {
  markdownToTiptap,
  combineTiptapObjects,
} = require("../middleware/wsNotes/compileGPTOutput/md2JSON");

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

      let ts = data.transcript;
      const token = data.token;
      const user = getUserIdFromToken(token);

      if (ts) {
        //get the id of the note which will only be passed when note is Activated
        const note_id = data.note_id;
        console.log("note_id in ws", note_id);

        const totTime = await calculateTotTime(note_id);

        //this is what needs to be appended to the full TS and thrown on to the active to see if it needs to be appended
        //throw on a date if it has a x charecter count

        /*
        let incomingTs = ts;

        if (Array.isArray(incomingTs)) {
          console.log("Incoming transcript is an array:", incomingTs);
        }

        if (typeof incomingTs === "string") {

          const formattedTime = formatElapsedTime(totTime);

          incomingTs = `${ts} \n\n ${formattedTime}\n`;
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
       

        //only pass the new ts to the AI query when the transcript gets reset it needs to pass the thresehold which it probaly should



        if (error) {
          throw error;
        }

        // console.log("frequncy", frequency);
        //if (activeTs && activeTs.length >= frequency) {
        //in theroy the thread ID should be passed into this function

        const activeTs = await fetchActiveTs(note_id, incomingTs);
        */

        if (Array.isArray(ts)) {
          ts = JSON.stringify(
            ts.map((obj) => {
              return {
                caption: obj.caption,
                speaker: obj.name ? obj.name : obj.speaker,
              };
            })
          );
          console.log(ts);
        }

        const { data: message, error } = await supabase
          .from("user")
          .select("note_frequency")
          .eq("user_id", user);

        const frequency = message[0].note_frequency || 700;

        const md = await queryAI(note_id, ts, frequency);

        //const debugPath = path.join(__dirname, "../logs/debuglog.txt");
        //await fsPromises.appendFile(debugPath, JSON.stringify(res, null, 2));
        //console.log(`AI ${JSON.stringify(res, null, 2)}`);

        //convert markdown into json
        //md will be null if the AI call fails or are turned off
        if (md) {
          //mdJSON includes type: "doc", content is just content
          const { fullDoc, contentLevel } = await markdownToTiptap(
            md,
            totTime,
            note_id
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
      //}
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
