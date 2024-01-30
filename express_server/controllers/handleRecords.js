const pool = require("../db/db");

const id = "ba3147a5-1bb0-4795-ba62-24b9b816f4a7";

const sendNotesFromPG = async (req, res) => {
  try {
    const { visibleNotes } = req.query;
    let result;
    console.log(visibleNotes);
    if (visibleNotes === true) {
      const noteQuery =
        "SELECT * FROM note WHERE visible = $1 AND user_id = $2";
      result = await pool.query(noteQuery, [visibleNotes, id]);
    } else {
      const noteQuery = "SELECT * FROM note WHERE user_id = $1";
      result = await pool.query(noteQuery, [id]);
    }
    const noteRecords = result.rows.map((record) => {
      return {
        ...record,
        status: "inactive",
      };
    });
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
    res.status(200).json({ message: "saved" });
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
    res.status(200).json({ message: "saved" });
  } catch (error) {
    res.sendStatus(401);
    console.error("Error:", error);
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
    res.status(200).json({ message: "saved" });
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

module.exports = {
  sendNotesFromPG,
  updateMarkdownToPG,
  updateTitleToPG,
  updateVisibilityPG,
  delNotePG,
};
//
