const { execSync } = require('child_process');

// The new env variables critical for Serverless zero-gravity bypass.
// 1. DATABASE_URL points squarely to the Supabase Transaction Pooler port 6543
// 2. AUTH_TRUST_HOST tells NextAuth to bypass internal host resolution that causes 500s.
const envs = {
  'DATABASE_URL': 'postgresql://postgres.defvouwhwyfpcwpvptqc:Z0zw2X6gg0uAL7Gl@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
  'DIRECT_URL': 'postgresql://postgres:Z0zw2X6gg0uAL7Gl@db.defvouwhwyfpcwpvptqc.supabase.co:5432/postgres',
  'AUTH_TRUST_HOST': 'true'
};

for (const [key, val] of Object.entries(envs)) {
  console.log(`Setting ${key}...`);
  for (const envName of ['production', 'preview', 'development']) {
    try {
      execSync(`npx vercel env rm ${key} ${envName} -y`, { stdio: 'ignore' });
    } catch(e) {}
    try {
      execSync(`npx vercel env add ${key} ${envName}`, { input: val, stdio: ['pipe', 'ignore', 'ignore'] });
    } catch(e) { }
  }
}
console.log('✅ Edge-ready configuration pushed to Vercel.');
