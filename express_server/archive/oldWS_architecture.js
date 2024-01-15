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
const { appendToJsonFile } = require("../middleware/wsNotes/writeNoteRecord");
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
      const justActivated = data.activation;

      const transPath = `../files/transcripts/${title}`;
      const dirPath = path.join(__dirname, transPath);
      const activePath = path.join(__dirname, `${transPath}/stepTS.txt`);
      const WholeTransPath = path.join(__dirname, `${transPath}/wholeTS.txt`);
      const SectionMarkdown = path.join(__dirname, `${transPath}/stepMD.txt`);
      const WholemarkDown = path.join(__dirname, `${transPath}/wholeMD.txt`);

      //if the dir does not exist create it and everything else
      /*
      const db = await JSON.parse(await fsPromises.readFile(noteDBpath));
      match = db.noteRecords.filter((record) => {
        return record.title === title;
      });*/

      if (justActivated) {
        const record = {
          title: title,
          note_id: uuid.v4(),
          markdown: "",
          status: "active",
        };
        console.log("++++++++++++++++++++++++++++++++++++++++++++");
        console.log(record);

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
        await fsPromises.writeFile(WholemarkDown, `###${title}`);
      }

      // write time text active and reg text to glob
      const oldTS = removeDateTimes(
        await fsPromises.readFile(WholeTransPath, "utf8")
      );

      console.log(`incoming ${ts}`);
      console.log(`oldts ${oldTS}`);
      const appendTS = subtractString(ts, oldTS);
      console.log(appendTS);
      await fsPromises.appendFile(activePath, appendTS);
      await fsPromises.appendFile(WholeTransPath, appendTS);
      setTimeout(async () => {
        const newTS = await fsPromises.readFile(activePath, "utf8");

        if (ts === removeDateTimes(newTS) && ts !== "") {
          console.log(data);
          const date = new Date();
          await fsPromises.appendFile(activePath, `<${date.toISOString}>`);
          console.log("if statement");

          ws.send(
            JSON.stringify({ md: null, resetState: true, noteRecord: null })
          );

          //only pass the new ts to the AI query
          //const res = await queryAI(ts);
          const res = "check";
          console.log(`AI ${res}`);

          //Append markdown
          await fsPromises.writeFile(SectionMarkdown, `${res}`);

          let markdown = "";
          //droping undefined because responce is not being parse c
          if (h2TagThreashold(res)) {
            //grab last DT in markdown
            const dateTime = findLastIsoDateTime(res);
            //split the DT TS to get the most relivent info
            const workingTS = splitTranscript(dateTime, res);
            //rewrite ts with what is needed
            await fsPromises.writeFile(activePath, workingTS);

            //split the active markdown
            const { completeSection, newSection } =
              splitMarkdownAtHeadings(res);

            // put the complete section into full file
            await fsPromises.appendFile(WholemarkDown, completeSection);
            const wholeMD = await fsPromises.readFile(WholemarkDown);

            markdown = `${wholeMD}\n${newSection}`;
          } else {
            const wholeMD = await fsPromises.readFile(WholemarkDown);
            markdown = `${wholeMD}\n${res}`;
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
      }, 3500);
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }
  });
}

module.exports = { handleWebSocketConnection };
