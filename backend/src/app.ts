import { bootstrap, app } from './bootstrap';
import env from '@/lib/env';

await bootstrap().catch((err: any) => {
  console.error('Failed to start backend server', err);
});

app.listen({ port: Number(env.PORT) }).catch((err: any) => {
  app.log.error(err);
  process.exit(1);
});
