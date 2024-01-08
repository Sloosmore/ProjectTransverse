const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const fsPromises = require("fs").promises;

async function record(prompt, uu_id) {
  let task_record = {
    task_id: uu_id,
    thread_id: null,
    date_created: new Date().toISOString(),
    last_update: new Date().toISOString(),
    prompt: [prompt],
    filename: null,
    file: null,
    content: null,
  };
  try {
    await write_json(task_record);
    return JSON.stringify(task_record);
  } catch (err) {
    console.error(err);
  }
}

async function write_json(new_data, filename = "fileRecords.json") {
  let script_dir = __dirname;
  let filepath = path.join(script_dir, "../../db/", filename);

  try {
    let data = await fsPromises.readFile(filepath, "utf8");
    let file_data = JSON.parse(data);
    file_data["records"].push(new_data);
    let jsonStr = JSON.stringify(file_data, null, 4);
    await fsPromises.writeFile(filepath, jsonStr, "utf8");
    console.log("JSON file has been saved.");
  } catch (err) {
    console.error(err);
  }
}

module.exports = { record };
