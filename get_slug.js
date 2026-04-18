const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();

  const cardsRes = await client.query('SELECT slug FROM "vCard" LIMIT 1');
  console.log("=== FIRST CARD SLUG === ", cardsRes.rows);

  await client.end();
}
main().catch(console.error);
