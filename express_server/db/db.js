const Pool = require('pg').Pool

const pool = new Pool({ 
    user: 'postgres',
    password: 'projectTv05',
    host: 'localhost',
    port: 5432,
    database: 'note_stack'})

module.exports = pool;