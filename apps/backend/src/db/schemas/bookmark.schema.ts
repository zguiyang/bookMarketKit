import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { usersTable } from './user.schema';
// =================== 书签表 ===================
export const bookmarksTable = pgTable('bookmarks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  user_id: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  url: text().notNull(),
  icon: text().notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text().default(null),
  visit_count: integer().default(0),
  is_favorite: integer().default(0),
  is_pinned: integer().default(0),
  screenshot_url: text().default(null),
  last_visited_at: timestamp().default(null),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const bookmarksRelations = relations(bookmarksTable, ({ many }) => ({
  categories: many(bookmarkCategoryRelationsTable),
  tags: many(bookmarkTagRelationsTable),
}));

// =================== 分类表 ===================

export const bookmarkCategoriesTable = pgTable('bookmark_categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  user_id: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  description: text(),
  icon: varchar({ length: 50 }),
  parent_id: text().references(() => bookmarkCategoriesTable.id, {
    onDelete: 'set null',
  }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const bookmarkCategoriesRelations = relations(
  bookmarkCategoriesTable,
  ({ many }) => ({
    bookmarkRelations: many(bookmarkCategoryRelationsTable),
  }),
);

// =================== 标签表 ===================
export const bookmarkTagsTable = pgTable('bookmark_tags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  user_id: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 50 }).notNull(),
  color: varchar({ length: 20 }),
  created_at: timestamp().defaultNow(),
});

export const bookmarkTagsRelations = relations(
  bookmarkTagsTable,
  ({ many }) => ({
    bookmarkRelations: many(bookmarkTagRelationsTable),
  }),
);

// =================== 关联表 ===================
// 书签-分类关联表
export const bookmarkCategoryRelationsTable = pgTable(
  'bookmark_category_relations',
  {
    bookmark_id: text()
      .notNull()
      .references(() => bookmarksTable.id, { onDelete: 'cascade' }),
    category_id: text()
      .notNull()
      .references(() => bookmarkCategoriesTable.id, { onDelete: 'cascade' }),
    created_at: timestamp().defaultNow(),
  },
  (table) => [unique().on(table.bookmark_id, table.category_id)],
);

export const bookmarkCategoryRelations = relations(
  bookmarkCategoryRelationsTable,
  ({ one }) => ({
    bookmark: one(bookmarksTable, {
      fields: [bookmarkCategoryRelationsTable.bookmark_id],
      references: [bookmarksTable.id],
    }),
    category: one(bookmarkCategoriesTable, {
      fields: [bookmarkCategoryRelationsTable.category_id],
      references: [bookmarkCategoriesTable.id],
    }),
  }),
);

// 书签-标签关联表
export const bookmarkTagRelationsTable = pgTable(
  'bookmark_tag_relations',
  {
    bookmark_id: text()
      .notNull()
      .references(() => bookmarksTable.id, { onDelete: 'cascade' }),
    tag_id: text()
      .notNull()
      .references(() => bookmarkTagsTable.id, { onDelete: 'cascade' }),
    created_at: timestamp().defaultNow(),
  },
  (table) => [unique().on(table.bookmark_id, table.tag_id)],
);

export const bookmarkTagRelations = relations(
  bookmarkTagRelationsTable,
  ({ one }) => ({
    bookmark: one(bookmarksTable, {
      fields: [bookmarkTagRelationsTable.bookmark_id],
      references: [bookmarksTable.id],
    }),
    tag: one(bookmarkTagsTable, {
      fields: [bookmarkTagRelationsTable.tag_id],
      references: [bookmarkTagsTable.id],
    }),
  }),
);

export type InsertBookmark = typeof bookmarksTable.$inferInsert;
export type SelectBookmark = typeof bookmarksTable.$inferSelect;
export type InsertBookmarkCategory =
  typeof bookmarkCategoriesTable.$inferInsert;
export type SelectBookmarkCategory =
  typeof bookmarkCategoriesTable.$inferSelect;
export type InsertBookmarkTag = typeof bookmarkTagsTable.$inferInsert;
export type SelectBookmarkTag = typeof bookmarkTagsTable.$inferSelect;
