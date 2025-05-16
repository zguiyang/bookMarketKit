import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

export const createAuthInstance = ({ dataBaseUri, secret }: { dataBaseUri: string; secret: string }) => {
  const client = new MongoClient(dataBaseUri);
  const db = client.db();
  return betterAuth({
    secret: secret,
    trustedOrigins: ['http://localhost:3091', 'https://bookmark.9crd.com'],
    basePath: '/auth', // customize the base path of the auth routes /auth not /api/auth
    database: mongodbAdapter(db),
    user: {
      modelName: 'users',
    },
    session: {
      modelName: 'sessions',
    },
    account: {
      modelName: 'accounts',
    },
    emailAndPassword: {
      enabled: true,
    },
    maxAge: 5 * 60,
  });
};
