import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

// 用户表定义
export const usersTable = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
  nickname: varchar({ length: 50 }),
  username: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
