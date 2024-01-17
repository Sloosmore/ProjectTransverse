const fsPromises = require("fs").promises;

async function appendToJsonFile(filePath, newData) {
  // Step 1: Read the existing data
  const data = await fsPromises.readFile(filePath, "utf8");

  // Step 2: Parse the data into a JavaScript object
  const obj = JSON.parse(data);
  const records = obj.noteRecords;

  // Step 3: Modify the object
  const record = records.find((record) => record.title === newData.title);
  if (record) {
    // Merge newData into the existing record
    Object.assign(record, newData);
  } else {
    // If no matching record is found, append the new data
    records.push(newData);
  }

  // Step 4: Package the updated records back into the original object
  obj.noteRecords = records;

  // Step 5: Convert the object back into a JSON string
  const json = JSON.stringify(obj, null, 2);

  // Step 6: Write the JSON string back to the file
  await fsPromises.writeFile(filePath, json, "utf8");
}


async function deactivateRecords(filePath) {
  // Read the existing data
  const data = await fsPromises.readFile(filePath, "utf8");

  // Parse the data into a JavaScript object
  const obj = JSON.parse(data);
  const records = obj.noteRecords;

  // Update the status of each record to "inactive"
  const updatedRecords = records.map((record) => {
    return { ...record, status: "inactive" };
  });

  // Package the updated records back into the original object
  obj.noteRecords = updatedRecords;

  // Convert the object back into a JSON string
  const json = JSON.stringify(obj, null, 2);

  // Write the JSON string back to the file
  await fsPromises.writeFile(filePath, json, "utf8");
}

module.exports = { appendToJsonFile, deactivateRecords };
