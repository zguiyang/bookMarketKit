import { workerData } from 'worker_threads';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// 获取 tsx 路径
const tsxPath = resolve(process.cwd(), 'node_modules/.bin/tsx');

// 启动 worker 进程
const child = spawn(tsxPath, [workerData.workerFile], {
  env: {
    ...process.env,
    WORKER_DATA: JSON.stringify(workerData),
  },
  stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
});

// 处理子进程消息并转发到主线程
child.on('message', (message) => {
  process.send?.(message);
});

// 处理子进程退出
child.on('exit', (code) => {
  process.exit(code || 0);
});

// 处理主线程消息并转发到子进程
process.on('message', (message) => {
  child.send(message);
});
