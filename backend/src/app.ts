import { bootstrap } from './bootstrap';

await bootstrap().catch((err: any) => {
  console.error('Failed to start backend server', err);
});
