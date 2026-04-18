const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();

  const userRes = await client.query('SELECT id, name, "emailVerified", image FROM "User" WHERE email = $1', ['karthanvenkateshvenkatesh@gmail.com']);
  console.log("=== THE LOGGED IN USER ===");
  console.log(userRes.rows);

  if (userRes.rows.length > 0) {
    const resCards = await client.query('SELECT id, slug, "firstName", "lastName" FROM "vCard" WHERE "userId" = $1', [userRes.rows[0].id]);
    console.log("=== THEIR CARDS ===");
    console.log(resCards.rows);
  }

  await client.end();
}
main().catch(console.error);
