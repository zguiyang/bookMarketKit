import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './user.schema';

// =================== 书签表 ===================
export const bookmarksTable = pgTable('bookmarks', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  url: text().notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text().default(null),
  visit_count: integer().default(0),
  is_favorite: integer().default(0),
  is_pinned: integer().default(0),
  favicon_url: text().default(null),
  screenshot_url: text().default(null),
  last_visited_at: timestamp().default(null),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// =================== 分类表 ===================

export const bookmarkCategoriesTable = pgTable('bookmark_categories', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  description: text(),
  color: varchar({ length: 20 }),
  icon: varchar({ length: 50 }),
  parent_id: uuid().references(() => bookmarkCategoriesTable.id, {
    onDelete: 'set null',
  }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// =================== 标签表 ===================
export const bookmarkTagsTable = pgTable('bookmark_tags', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 50 }).notNull(),
  color: varchar({ length: 20 }),
  created_at: timestamp().defaultNow(),
});

// =================== 关联表 ===================
// 书签-分类关联表
export const bookmarkCategoryRelationsTable = pgTable(
  'bookmark_category_relations',
  {
    bookmark_id: uuid()
      .notNull()
      .references(() => bookmarksTable.id, { onDelete: 'cascade' }),
    category_id: uuid()
      .notNull()
      .references(() => bookmarkCategoriesTable.id, { onDelete: 'cascade' }),
    created_at: timestamp().defaultNow(),
  },
  (table) => [unique().on(table.bookmark_id, table.category_id)],
);

// 书签-标签关联表
export const bookmarkTagRelationsTable = pgTable(
  'bookmark_tag_relations',
  {
    bookmark_id: uuid()
      .notNull()
      .references(() => bookmarksTable.id, { onDelete: 'cascade' }),
    tag_id: uuid()
      .notNull()
      .references(() => bookmarkTagsTable.id, { onDelete: 'cascade' }),
    created_at: timestamp().defaultNow(),
  },
  (table) => [unique().on(table.bookmark_id, table.tag_id)],
);
