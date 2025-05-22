import { MongoClient } from 'mongodb';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

import env from './env';

const client = new MongoClient(env.DATABASE_URI);
const db = client.db();

const config = {
  database: mongodbAdapter(db),
  secret: env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
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
  trustedOrigins: [env.WEB_URL],
  advanced: {
    cookiePrefix: 'bookmark',
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);

export type AuthType = typeof auth;
