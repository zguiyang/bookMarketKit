import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
