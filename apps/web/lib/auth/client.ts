import { cache } from 'react';
import { createAuthClient } from 'better-auth/react';
import { usernameClient } from 'better-auth/client/plugins';

export const client = createAuthClient({
  plugins: [usernameClient()],
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const getCurrentUser = cache(async () => await client.getSession().then((session) => session?.data?.user));
