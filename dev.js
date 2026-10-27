const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n======================================================');
console.log('🚀 Starting Hope Somalia Foundation (Backend + Frontend)');
console.log('======================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

// Prepare local SQLite Prisma client when Postgres is not configured
try {
  require(path.join(serverDir, 'src', 'bootstrapLocalDb'))();
} catch (err) {
  console.warn('⚠️ Local database bootstrap skipped:', err.message);
}

// 1. Start Backend API Server (Port 5000)
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
});

// 2. Start Frontend Vite Dev Server (Port 5173)
const viteBin = path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');
const clientCommand = fs.existsSync(viteBin) ? process.execPath : npmCmd;
const clientArgs = fs.existsSync(viteBin) ? [viteBin] : ['run', 'dev'];

const client = spawn(clientCommand, clientArgs, {
  cwd: clientDir,
  stdio: 'inherit',
  shell: fs.existsSync(viteBin) ? false : true,
});

const cleanup = () => {
  console.log('\n🛑 Shutting down server and client processes...');
  if (server.pid) {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
      } else {
        server.kill();
      }
    } catch (_) {}
  }
  if (client.pid) {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', client.pid.toString(), '/f', '/t']);
      } else {
        client.kill();
      }
    } catch (_) {}
  }
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
