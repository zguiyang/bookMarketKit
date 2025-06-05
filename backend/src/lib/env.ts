import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV) {
  config({ path: `.env.${process.env.NODE_ENV}`, override: true });
} else {
  config({ path: '.env.development', override: true });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),

  DATABASE_URI: z.string().min(1),

  REDIS_URL: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_DB: z.coerce.number().default(0),

  PORT: z.coerce.number().optional(),
});

const env = envSchema.parse(process.env);

export type EnvConfig = z.infer<typeof envSchema>;

export default env;
