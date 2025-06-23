import { bootstrap, app } from './bootstrap.js';
import env from '@/lib/env.js';

await bootstrap().catch((err: any) => {
  console.error('Failed to start backend server', err);
});

app.listen({ port: Number(env.PORT) }).catch((err: any) => {
  app.log.error(err);
  process.exit(1);
});
