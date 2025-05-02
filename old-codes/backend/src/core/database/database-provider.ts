import { type NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schemas from '@/db/schemas';

export const DB_PROVIDER = Symbol('DB_PROVIDER');
export type DbType = NodePgDatabase<typeof schemas>;
