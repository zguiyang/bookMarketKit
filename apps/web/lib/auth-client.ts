import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export type SessionResponse = typeof authClient.$Infer.Session;
export type Session = SessionResponse['session'];
export type SessionUser = SessionResponse['user'];
