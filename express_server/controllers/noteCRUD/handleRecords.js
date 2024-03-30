const pool = require("../../db/db");
const {
  deactivateRecords,
} = require("../../middleware/wsNotes/databaseOps/deactivateNotes");
const supabase = require("../../db/supabase");
const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");

const id = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";
const { uuid } = require("uuidv4");
const { calculateTotTime } = require("../../middleware/infoTracking/calcTime");
const {
  replaceTimeWithCurrent,
} = require("../../middleware/infoTracking/addTimeJson");

//GET folders from auth
const sendFoldersFromSB = async (req, res) => {
  try {
    console.log("Fetching folders...");
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    console.log(user_id);

    const result = await supabase
      .from("folder")
      .select("*")
      .eq("user_id", user_id);
    let folderRecords = result.data;
    res.status(200).json({ folderRecords });
  } catch (error) {
    folderRecords = ["test"];
    res.status(401).json({ folderRecords });

    console.error("Error:", error);
  }
};

//POST folder from auth
const postFolderToSB = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    const title = "Untitled Folder";
    const folder_id = uuid();

    const result = await supabase
      .from("folder")
      .insert({ title, folder_id, user_id });
    res.status(200).json({ folder_id });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(401);
  }
};

//UP folder title
const upFolderTitleToSB = async (req, res) => {
  try {
    const { folder_id, title } = req.body;
    console.log("Updating title to DB...");
    const result = await supabase
      .from("folder")
      .update({ title: title })
      .eq("folder_id", folder_id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved title ${title}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//DEL folder
const delFolder = async (req, res) => {
  try {
    const { folder_id } = req.query;
    const result = await supabase
      .from("folder")
      .delete()
      .eq("folder_id", folder_id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `deleted folder ${folder_id}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//GET notes AUTH
const sendNotesFromSB = async (req, res) => {
  try {
    const { resume } = req.query;
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);
    let result;
    result = await supabase
      .from("note")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_deleted", false);

    let noteRecords = result.data;
    if (!resume) {
      console.log("resume not sent!");
      //**this is the issue**//

      noteRecords = await deactivateRecords(user_id);
    }
    console.log("Sending records...");
    res.status(200).json({ noteRecords });
  } catch (error) {
    res.status(500).json({ noteRecords: [] });
    console.error("Error:", error);
  }
};

//UP STATUS (TO INACTIVE) AUTH
const upInactiveStatus = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);

    // Update the status of the notes
    const { error: updateError } = await supabase
      .from("note")
      .update({ status: "inactive" })
      .eq("user_id", user_id);

    if (updateError) {
      throw updateError;
    }

    // Retrieve the updated notes
    const { data: noteRecords, error: selectError } = await supabase
      .from("note")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "inactive")
      .eq("is_deleted", false);

    if (selectError) {
      throw selectError;
    }

    res.status(200).json({ noteRecords });
  } catch (err) {
    res.sendStatus(401);
    console.error("Error:", err);
  }
};

//UP MD (no auth needed for MVP)
const updateMarkdownToSB = async (req, res) => {
  try {
    const { note_id, markdown, json_content } = req.body;
    console.log("json_content", json_content);
    console.log("Updating Markdown to DB...");
    console.log("note_id", note_id);

    //calculate time diff here and null notes
    const totTime = await calculateTotTime(note_id);
    console.log("totTime", totTime);
    //replace any nulls with a time stamp

    const newJsonContent = replaceTimeWithCurrent(json_content, totTime);

    //console.log(`${markdown}`);
    const result = await supabase
      .from("note")
      .update({
        full_markdown: markdown,
        date_updated: new Date(),
        json_content: json_content,
      })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved markdown ${markdown}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Save markdown error error:", error);
  }
};

//UP TITLE (no auth needed for MVP)
const updateTitleToSB = async (req, res) => {
  try {
    const { note_id, title } = req.body;
    console.log("Updating title to DB...");
    const result = await supabase
      .from("note")
      .update({ title: title, date_updated: new Date() })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved title ${title}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//UP VIS (no auth needed for MVP)
const updateVisibilitySB = async (req, res) => {
  try {
    const { note_id, visible } = req.body;
    const result = await supabase
      .from("note")
      .update({
        visible: visible,
        date_updated: new Date(),
        status: "inactive",
      })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved ${visible}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//DEL (no auth needed for MVP)
const delNoteSB = async (req, res) => {
  try {
    const { note_id } = req.query;
    const result = await supabase
      .from("note")
      .update({ is_deleted: true })
      .eq("note_id", note_id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `deleted note ${note_id}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

module.exports = {
  sendNotesFromSB,
  updateMarkdownToSB,
  updateTitleToSB,
  updateVisibilitySB,
  delNoteSB,
  upInactiveStatus,
  sendFoldersFromSB,
  postFolderToSB,
  upFolderTitleToSB,
  delFolder,
};
//
