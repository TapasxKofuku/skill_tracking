
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        level INTEGER NOT NULL
      );
    `);
    console.log('Table "skills" created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    client.release();
  }
}

createTable();
