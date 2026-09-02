const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bodytracker',
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = pool;