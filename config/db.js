const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
});

client.connect()
  .then(() => console.log("Database connected"))
  .catch(e => console.error('Database connection error:', e.stack));

module.exports = client;
