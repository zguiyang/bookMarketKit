import { pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import {
  bookmarksTable,
  bookmarkCategoriesTable,
  bookmarkTagsTable,
} from './bookmark.schema';

// 用户表定义
export const usersTable = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  nickname: varchar({ length: 50 }),
  username: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// 用户关联关系定义
export const usersRelations = relations(usersTable, ({ many }) => ({
  bookmarks: many(bookmarksTable),
  categories: many(bookmarkCategoriesTable),
  tags: many(bookmarkTagsTable),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
