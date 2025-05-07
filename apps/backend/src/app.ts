import { app, bootstrap } from './bootstrap.js';

await bootstrap();

const PORT = app.config.PORT ? Number(app.config.PORT) : 3090;

app.listen({ port: PORT }).catch((err: any) => {
  app.log.error(err);
  process.exit(1);
});
