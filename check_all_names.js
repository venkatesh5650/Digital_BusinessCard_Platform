const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();

  const userRes = await client.query('SELECT id, name, email FROM "User"');
  console.log("=== ALL USERS IN VERCEL SUPABASE DB ===");
  console.log(userRes.rows);

  await client.end();
}
main().catch(console.error);
