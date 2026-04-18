const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();

  const res = await client.query('SELECT id, name, email FROM "User"');
  console.log("=== ALL USERS ===");
  console.log(res.rows);

  const resCards = await client.query('SELECT "userId", slug, "firstName", "lastName" FROM "Card"');
  console.log("=== ALL CARDS ===");
  console.log(resCards.rows);

  await client.end();
}
main().catch(console.error);
