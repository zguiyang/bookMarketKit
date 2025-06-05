import { workerData } from 'worker_threads';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Get tsx path
const tsxPath = resolve(process.cwd(), 'node_modules/.bin/tsx');

// Start worker process
const child = spawn(tsxPath, [workerData.workerFile], {
  env: {
    ...process.env,
    WORKER_DATA: JSON.stringify(workerData),
  },
  stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
});

// Handle child process messages and forward to the main thread
child.on('message', (message) => {
  process.send?.(message);
});

// Handle child process exit
child.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle main thread messages and forward to the child process
process.on('message', (message) => {
  child.send(message);
});
