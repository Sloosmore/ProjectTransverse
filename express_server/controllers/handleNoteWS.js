const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const uuid = require("uuid");
const { isUtf8 } = require("buffer");
const fetch = require("node-fetch");

const { queryAI } = require("../middleware/wsNotes/gptMD");
const {
  appendToJsonFile,
  deactivateRecords,
} = require("../middleware/wsNotes/writeNoteRecord");
const { record } = require("../middleware/writeTaskDB");

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

      if (justActivated) {
        //deactive all other note if it matches user

        //------------------------------------------


        //write new record to DB
        /*
        note_id =  uuid.v4()
        user_id = user 
        title = title
        markdown = {title}
        status = active
        date_created = date.now
        date_updated = date.now
        */

        
        //send returned record from DB

        ws.send(
          JSON.stringify({
            md: "",
            resetState: false,
            noteRecord: record,
          })
        );


      } else if (ts.length > 500) {
        // write time text active and reg text to glob
        console.log(ts);
        const date = new Date();
        await fsPromises.appendFile(
          activePath,
          `<${date.toISOString()}> ${ts}`
        );
        await fsPromises.appendFile(WholeTransPath, ts);

        ws.send(
          JSON.stringify({ md: null, resetState: true, noteRecord: null })
        );

        //only pass the new ts to the AI query when the transcript gets reset it needs to pass the thresehold which it probaly should

        const transAI = await fsPromises.readFile(activePath, "utf-8");
        const res = await queryAI(transAI);
        console.log(`AI ${JSON.stringify(res, null, 2)}`);
        const md = res["data"][0]["content"][0]["text"]["value"];
        //Append markdown
        await fsPromises.writeFile(SectionMarkdown, md);

        //final MD to be sent to the front
        let markdown = "";
        //droping undefined because responce is not being parse c
        if (h2TagThreashold(md)) {
          //grab last DT in markdown
          const dateTime = findLastIsoDateTime(md);
          //split the DT TS to get the most relivent info
          console.log(
            "---------------------------------------------------------------------------------------------------------"
          );
          console.log(`Datetime:${dateTime}`);
          console.log(md);
          console.log(
            "---------------------------------------------------------------------------------------------------------"
          );

          const workingTS = splitTranscript(dateTime, transAI);
          //rewrite ts with what is needed
          await fsPromises.writeFile(activePath, workingTS);

          //split the active markdown
          const { completeSection, newSection } = splitMarkdownAtHeadings(md);

          // put the complete section into full file
          await fsPromises.appendFile(WholemarkDown, completeSection);
          const wholeMD = await fsPromises.readFile(WholemarkDown);

          markdown = `${wholeMD}\n${newSection}`;
        } else {
          const wholeMD = await fsPromises.readFile(WholemarkDown);
          markdown = `${wholeMD}\n${md}`;
        }

        const updatedMDRecord = {
          title: title,
          markdown: markdown,
        };

        await appendToJsonFile(noteDBpath, updatedMDRecord);

        ws.send(
          JSON.stringify({
            md: markdown,
            resetState: false,
            noteRecord: null,
          })
        );
      } else (

        //send timestamped transcript
        ws.send(
          JSON.stringify({
            md: "",
            resetState: false,
            noteRecord: record,
          })
        )
      )
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }
  });
}

module.exports = { handleWebSocketConnection };
