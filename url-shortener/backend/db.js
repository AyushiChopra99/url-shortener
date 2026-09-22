const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',          // XAMPP default = empty
  database: 'url_shortener',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
