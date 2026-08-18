const { spawn } = require('child_process');
const path = require('path');

console.log('\n======================================================');
console.log('🚀 Starting Hope Somalia Foundation (Backend + Frontend)');
console.log('======================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Backend API Server (Port 5000)
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// 2. Start Frontend Vite Dev Server (Port 5173)
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
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
