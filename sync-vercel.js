const { spawnSync } = require('child_process');
const fs = require('fs');

async function syncEnvs() {
  if (!fs.existsSync('.env')) {
    console.error('.env file not found');
    process.exit(1);
  }

  const content = fs.readFileSync('.env', 'utf-8');
  const lines = content.split('\n');

  const envs = {};
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      
      if (key === 'NEXTAUTH_URL' && val.includes('localhost')) continue;
      
      envs[key] = val;
    }
  }

  const targets = ['production', 'preview'];

  for (const [key, val] of Object.entries(envs)) {
    console.log(`\n--- Processing ${key} ---`);
    for (const target of targets) {
      console.log(`Removing existing ${key} from ${target}...`);
      spawnSync('npx.cmd', ['vercel', 'env', 'rm', key, target, '-y'], { stdio: 'ignore' });

      console.log(`Adding ${key} to ${target}...`);
      // Use spawnSync to avoid shell parsing issues with '&'
      const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', key, target, '--value', val, '--yes'], {
        stdio: 'inherit'
      });
      
      if (result.status !== 0) {
        console.error(`Failed to add ${key} to ${target}`);
      }
    }
  }

  console.log('\n✅ Successfully synced environment variables to Vercel.');
}

syncEnvs();
