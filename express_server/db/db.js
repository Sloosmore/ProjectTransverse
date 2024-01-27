const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "projectTvs05",
  host: "localhost",
  port: 5432,
  database: "note_stack",
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 20000,
  allowExitOnIdle: false,
});

(async () => {
  const { rows } = await pool.query('SELECT * FROM "user"');
  console.log(rows);
})();

module.exports = pool;
