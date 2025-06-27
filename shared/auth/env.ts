import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URI: z.string().min(1),
  BETTER_AUTH_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const env = envSchema.parse(process.env);

export { env };
