import { authInstance } from './instance';

export * from './env';
export * from './instance'

export type AuthType = typeof authInstance;
export type SessionResponse = typeof authInstance.$Infer.Session;
export type Session = typeof authInstance.$Infer.Session.session;
export type SessionUser = typeof authInstance.$Infer.Session.user;
