import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

import env from './env';

const client = new MongoClient(env.DATABASE_URI);
const db = client.db();

console.log('WEB_URL', process.env.WEB_URL, env.WEB_URL);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'users',
  },
  account: {
    modelName: 'accounts',
  },
  session: {
    modelName: 'sessions',
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  basePath: '/auth',
  trustedOrigins: [env.WEB_URL, 'http://localhost:3091'],
  advanced: {
    cookiePrefix: 'bookmark',
  },
});

export type AuthType = typeof auth;
