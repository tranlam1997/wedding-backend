const mysql = require('mysql2/promise');
// Connection pool pool (for common queries)
const pool = mysql.createPool({
    host: '45.76.161.36',
    user: 'root',
    port: '3307',
    password: '56781234',
    database: 'wedding',
    multipleStatements: true,
    // debug: true,
});

module.exports = pool;