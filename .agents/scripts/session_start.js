const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

let rawInput = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  rawInput += chunk;
});

process.stdin.on('end', async () => {
  try {
    const isPortOpen = await checkPort(4200);

    if (isPortOpen) {
      outputResult({
        injectSteps: [
          {
            ephemeralMessage: 'Local dev server is active and accessible at http://localhost:4200/'
          }
        ]
      });
      return;
    }

    // Port is closed, start dev server in background
    const rootDir = path.resolve(__dirname, '..', '..');
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['start'], {
      cwd: rootDir,
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    });
    child.unref();

    outputResult({
      injectSteps: [
        {
          ephemeralMessage: 'Local dev server automatically launched in background at http://localhost:4200/'
        }
      ]
    });
  } catch (err) {
    outputResult({
      injectSteps: [
        {
          ephemeralMessage: `SessionStart hook notice: Dev server check skipped (${err.message}).`
        }
      ]
    });
  }
});

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, 'localhost');
    socket.setTimeout(800);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function outputResult(result) {
  process.stdout.write(JSON.stringify(result) + '\n');
}
