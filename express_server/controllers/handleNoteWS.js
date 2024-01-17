const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const uuid = require("uuid");
const { isUtf8 } = require("buffer");
const fetch = require("node-fetch");
const {
  h2TagThreashold,
  splitMarkdownAtHeadings,
  splitTranscript,
  findLastIsoDateTime,
  removeDateTimes,
  subtractString,
} = require("../middleware/wsNotes/wsParse");
const { queryAI } = require("../middleware/wsNotes/gptMD");
const {
  appendToJsonFile,
  deactivateRecords,
} = require("../middleware/wsNotes/writeNoteRecord");
const { record } = require("../middleware/writeTaskDB");
//the temporary markdown section may not be needed but good to have in place in case

const noteDBpath = path.join(__dirname, "../..", "/db/noteRecords.json");

// read in
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

      const transPath = `../files/transcripts/${title}`;
      const dirPath = path.join(__dirname, transPath);
      const activePath = path.join(__dirname, `${transPath}/stepTS.txt`);
      const WholeTransPath = path.join(__dirname, `${transPath}/wholeTS.txt`);
      const SectionMarkdown = path.join(__dirname, `${transPath}/stepMD.txt`);
      const WholemarkDown = path.join(__dirname, `${transPath}/wholeMD.txt`);

      if (justActivated) {
        await deactivateRecords(noteDBpath);

        const record = {
          title: title,
          note_id: uuid.v4(),
          markdown: `# ${title}`,
          status: "active",
        };
        console.log("++++++++++++++++++++++++++++++++++++++++++++");

        //send inital record

        ws.send(
          JSON.stringify({
            md: "",
            resetState: false,
            noteRecord: record,
          })
        );

        await appendToJsonFile(noteDBpath, record);

        await fsPromises.mkdir(dirPath);
        await fsPromises.writeFile(activePath, "");
        await fsPromises.writeFile(WholeTransPath, "");
        await fsPromises.writeFile(SectionMarkdown, "");
        await fsPromises.writeFile(WholemarkDown, `# ${title} \n\n`);
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
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }
  });
}

module.exports = { handleWebSocketConnection };
