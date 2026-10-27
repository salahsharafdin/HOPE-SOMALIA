const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const serverRoot = path.resolve(__dirname, '..');
const sqliteSchema = path.join(serverRoot, 'prisma', 'schema.sqlite.prisma');
const devDbPath = path.join(serverRoot, 'prisma', 'dev.db');

function shouldUseLocalSqlite() {
  if (process.env.FORCE_POSTGRES === 'true') return false;
  if (process.env.NODE_ENV === 'production') return false;

  const url = (process.env.DATABASE_URL || '').trim();
  if (!url) return true;
  if (url.startsWith('file:')) return true;
  if (/localhost:5432|127\.0\.0\.1:5432/.test(url)) return true;
  return false;
}

function bootstrapLocalDatabase() {
  if (!shouldUseLocalSqlite()) return;

  const dbUrl = process.env.DATABASE_URL?.startsWith('file:')
    ? process.env.DATABASE_URL
    : `file:${devDbPath}`;

  process.env.DATABASE_URL = dbUrl;
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  const runPrisma = (args) => {
    execSync(`npx prisma ${args} --schema "${sqliteSchema}"`, {
      cwd: serverRoot,
      stdio: 'inherit',
      env: process.env,
    });
  };

  try {
    if (!fs.existsSync(devDbPath)) {
      runPrisma('generate');
      runPrisma('db push --accept-data-loss');
      console.log('✅ Local SQLite database created at server/prisma/dev.db');
    } else {
      console.log('ℹ️ Local dev using SQLite at server/prisma/dev.db');
    }
  } catch (err) {
    console.warn('⚠️ Could not prepare local SQLite database:', err.message);
    console.warn('   Stop other API processes and run: npm run dev');
  }
}

module.exports = bootstrapLocalDatabase;
