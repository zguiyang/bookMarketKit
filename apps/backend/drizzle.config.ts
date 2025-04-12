import dotent from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotent.config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

console.log(process.env.DATABASE_URL);
