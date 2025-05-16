import type { auth } from './auth';

export type SessionResponse = typeof auth.$Infer.Session;
export type Session = typeof auth.$Infer.Session.session;
export type SessionUser = typeof auth.$Infer.Session.user;
