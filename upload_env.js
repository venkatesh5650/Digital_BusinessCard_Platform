const { execSync } = require('child_process');
const fs = require('fs');

const content = fs.readFileSync('.env', 'utf-8');
const lines = content.split('\n');

const envs = {};
for (const line of lines) {
  if (!line || line.startsWith('#')) continue;
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    envs[key] = val;
  }
}

// Override NEXTAUTH_URL for Vercel
envs['NEXTAUTH_URL'] = 'https://digital-business-card-platform-puce.vercel.app';

for (const [key, val] of Object.entries(envs)) {
  console.log(`Setting ${key}...`);
  try {
    for (const envName of ['production', 'preview', 'development']) {
      try {
        execSync(`npx vercel env rm ${key} ${envName} -y`, { stdio: 'ignore' });
      } catch(e) {}
      execSync(`npx vercel env add ${key} ${envName}`, { input: val });
    }
    console.log(`Successfully added ${key}`);
  } catch (e) {
    console.error(`Failed to set ${key}: ${e.message}`);
  }
}
