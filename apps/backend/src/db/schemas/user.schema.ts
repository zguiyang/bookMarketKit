import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  nickname: varchar({ length: 50 }), // 移除 .default(null)，允许为 null 但不设置默认值
  username: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
