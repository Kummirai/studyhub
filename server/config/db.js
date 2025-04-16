const { Pool } = require('pg');
const config = require('config');

const dbConfig = config.get('db');

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('PostgreSQL connected successfully:', res.rows[0]);
  }
});

module.exports = pool;