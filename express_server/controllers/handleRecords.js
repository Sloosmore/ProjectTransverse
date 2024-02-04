const pool = require("../db/db");
const { deactivateRecords } = require("../middleware/wsNotes/deactivateNotes");
const supabase = require("../db/supabase");

const id = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

/*
const sendNotesFromPG = async (req, res) => {
  try {
    const { visibleNotes, resume } = req.query;
    let result;
    if (visibleNotes === "true") {
      const noteQuery =
        "SELECT * FROM note WHERE visible = $1 AND user_id = $2 AND is_deleted = false";
      result = await pool.query(noteQuery, [visibleNotes, id]);
    } else {
      const noteQuery =
        "SELECT * FROM note WHERE user_id = $1 AND is_deleted = false";
      result = await pool.query(noteQuery, [id]);
    }
    let noteRecords = result.rows;
    if (!resume) {
      console.log("resume not sent!");
      //this is the issue//

      const user = data.user || "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";
      noteRecords = await deactivateRecords(user);
    }
    console.log("Sending records...");
    res.status(200).json({ noteRecords });
  } catch (error) {
    console.error("Error:", error);
  }
};

//UP MARKDOWN
const updateMarkdownToPG = async (req, res) => {
  try {
    const { id, markdown } = req.body;
    console.log("Updating Markdown to DB...");
    console.log(`${markdown}`);
    const mdQuery =
      "UPDATE note SET full_markdown = $1, date_updated = NOW() WHERE note_id = $2";
    const mdQueryParams = [markdown, id];
    const result = await pool.query(mdQuery, mdQueryParams);
    res.status(200).json({ message: `saved markdown ${markdown}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};


//UP TITLE
const updateTitleToPG = async (req, res) => {
  try {
    const { id, title } = req.body;
    console.log("Updating title to DB...");
    const titleQuery =
      "UPDATE note SET title = $1, date_updated = NOW() WHERE note_id = $2";
    const titleQueryParams = [title, id];
    const result = await pool.query(titleQuery, titleQueryParams);
    res.status(200).json({ message: `saved title ${title}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};


//UP STATUS (INACTIVE)
const upInactiveStatus = async (req, res) => {
  try {
    const user = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";
    const noteRecords = await deactivateRecords(user);
    res.status(200).json({ noteRecords });
  } catch (err) {
    res.sendStatus(401);
    console.error("Error:", err);
  }
};


//UP VISIBILITY
const updateVisibilityPG = async (req, res) => {
  try {
    const { id, visible } = req.body;
    //visibile is a bool
    const visQuery = `UPDATE note SET visible = $1, date_updated = NOW(), status = 'inactive' WHERE note_id = $2`;
    const visQueryParams = [visible, id];
    const result = await pool.query(visQuery, visQueryParams);
    res.status(200).json({ message: `saved ${visible}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};


//DEL
const delNotePG = async (req, res) => {
  try {
    const { note_id } = req.query;
    const delQuery = `UPDATE note SET is_deleted = true WHERE note_id = $1`;
    //const delQuery = `DELETE note WHERE note_id = $1`;
    const delQueryParams = [note_id];
    const result = await pool.query(delQuery, delQueryParams);
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};
*/

//GET notes
const sendNotesFromSB = async (req, res) => {
  try {
    const { visibleNotes, resume } = req.query;
    let result;
    if (visibleNotes === "true") {
      result = await supabase
        .from("note")
        .select("*")
        .eq("visible", visibleNotes)
        .eq("user_id", id)
        .eq("is_deleted", false);
    } else {
      result = await supabase
        .from("note")
        .select("*")
        .eq("user_id", id)
        .eq("is_deleted", false);
    }
    let noteRecords = result.data;
    if (!resume) {
      console.log("resume not sent!");
      //**this is the issue**//

      const user = data.user || "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";
      noteRecords = await deactivateRecords(user);
    }
    console.log("Sending records...");
    res.status(200).json({ noteRecords });
  } catch (error) {
    console.error("Error:", error);
  }
};

//UP MD
const updateMarkdownToSB = async (req, res) => {
  try {
    const { id, markdown } = req.body;
    console.log("Updating Markdown to DB...");

    //console.log(`${markdown}`);
    const result = await supabase
      .from("note")
      .update({ full_markdown: markdown, date_updated: new Date() })
      .eq("note_id", id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved markdown ${markdown}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//UP TITLE
const updateTitleToSB = async (req, res) => {
  try {
    const { id, title } = req.body;
    console.log("Updating title to DB...");
    const result = await supabase
      .from("note")
      .update({ title: title, date_updated: new Date() })
      .eq("note_id", id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved title ${title}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//UP STATUS (TO INACTIVE)
const upInactiveStatus = async (req, res) => {
  try {
    const user = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

    // Update the status of the notes
    const { error: updateError } = await supabase
      .from("note")
      .update({ status: "inactive" })
      .eq("user_id", user);

    if (updateError) {
      throw updateError;
    }

    // Retrieve the updated notes
    const { data: noteRecords, error: selectError } = await supabase
      .from("note")
      .select("*")
      .eq("user_id", user)
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

//UP VIS
const updateVisibilitySB = async (req, res) => {
  try {
    const { id, visible } = req.body;
    const result = await supabase
      .from("note")
      .update({
        visible: visible,
        date_updated: new Date(),
        status: "inactive",
      })
      .eq("note_id", id);
    if (result.error) {
      throw result.error;
    }
    res.status(200).json({ message: `saved ${visible}` });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
  }
};

//DEL
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
};
//
