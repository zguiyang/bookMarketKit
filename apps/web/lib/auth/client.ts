import { createAuthClient } from 'better-auth/react';
import { cache } from 'react';

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_WEB_URL,
});

export const getCurrentUser = cache(async () => await client.getSession().then((session) => session?.data?.user));
