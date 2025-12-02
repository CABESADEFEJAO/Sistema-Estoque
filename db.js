const { Pool } = require('pg');

const pool = new Pool({
<<<<<<< HEAD
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'estoque',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
=======
  user: 'postgres',
  host: 'localhost',
  database: 'estoque',
  password: 'root',
  port: 5432,
>>>>>>> origin/main
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
