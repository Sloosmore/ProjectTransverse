const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const uuid = require("uuid");
const { isUtf8 } = require("buffer");
const fetch = require("node-fetch");

// read in
async function handleWebSocketConnection(ws, request) {
  const noteRecord = {
    ID: uuid(),
    DateCreated: new Date().toISOString(),
    reqContent: request || "default",
  };

  const transPath = `../files/transcripts/${noteRecord.ID}`;

  const dirPath = path.join(__dirname, transPath);

  const activePath = path.join(__dirname, `${transPath}/step.txt`);
  const globTransPath = path.join(__dirname, `${transPath}/glob.txt`);
  const markDown = path.join(__dirname, `${transPath}/md.txt`);

  await fsPromises.mkdir(dirPath);
  await fsPromises.writeFile(globTransPath);
  await fsPromises.writeFile(activePath);
  await fsPromises.writeFile(markDown);

  //Append note record to db

  ws.on("message", async (message) => {
    data = JSON.parse(message);
    console.log(data);
    await fsPromises.writefile(transPath, data.transcript);
    setTimeout(async () => {
      const ts = await fsPromises.readFile(transPath, "utf8");
      if ((data.transcript === ts) != "") {
        ws.send({ md: null, resetState: true });

        await fsPromises.writeFile(transPath);
        await fsPromises.appendFile(globTransPath, ts);

        res = await queryAI(ts);

        //Append markdown
        let backTrace = true;
        if (backTrace) {
          await fsPromises.appendFile(markDown);
          markDown = await fsPromises.readFile(markDown);
        } else {
          const ActionNeeded = true;
        }

        ws.send({ md: markdown, resetState: false });
      }
    }, 5000);

    //

    ws.send(`request recieved`);
  });

  ws.send("Connected to WebSocket!");
}

const apiUrl = "http://localhost:1234/v1/chat/completions";

let conversationHistory = [
  { role: "system", content: "Always answer in rhymes." },
];

async function queryAI(message) {
  // Add the new user message to the conversation history
  conversationHistory.push({ role: "user", content: message });

  // Prepare the request body with the updated conversation history
  const requestBody = {
    model: "local-model", // this field is currently unused
    messages: conversationHistory,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer YOUR_API_KEY' // Not needed for local queries
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message;

    // Add the AI response to the conversation history
    conversationHistory.push({ role: "assistant", content: aiResponse });

    console.log(aiResponse); // Log the AI response
    return aiResponse;
  } catch (error) {
    console.error("Error querying AI model: ", error);
  }
}

module.exports = { handleWebSocketConnection };
