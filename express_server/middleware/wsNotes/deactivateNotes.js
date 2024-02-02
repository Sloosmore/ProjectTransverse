const pool = require("../../db/db");

const deactivateRecords = async (user) => {
  const user_id = user;
  const inactiveQuery =
    "UPDATE note SET status = $1, date_updated = NOW() WHERE user_id = $2 RETURNING *";
  const inactiveValues = ["inactive", user_id];
  const { rows: inactiveRows } = await pool.query(
    inactiveQuery,
    inactiveValues
  );
  return inactiveRows;
};

module.exports = { deactivateRecords };
