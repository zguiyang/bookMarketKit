<script setup lang="ts">
import type { BookmarkResponse } from '@bookmark/schemas';
definePageMeta({
  layout: 'bookmark-layout',
});

const bookmarks: BookmarkResponse[] = [
  {
    _id: '1',
    title: 'Bookmark 1',
    description: 'This is a bookmark',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    tags: [],
    categories: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    visitCount: 0,
    isFavorite: 1,
    isPinned: 0,
    user: '1',
  },
  {
    _id: '2',
    title: 'Bookmark 2',
    description: 'This is a bookmark',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    tags: [],
    categories: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    visitCount: 0,
    isFavorite: 1,
    isPinned: 0,
    user: '1',
  },
  {
    _id: '3',
    title: 'Bookmark 3',
    description: 'This is a bookmark',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    tags: [],
    categories: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    visitCount: 0,
    isFavorite: 1,
    isPinned: 0,
    user: '1',
  },
];
</script>

<template>
  <div class="px-4 py-6">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">📌 置顶书签</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <bookmark-card v-for="bookmark in bookmarks" :key="bookmark._id" :bookmark="bookmark"></bookmark-card>
      </div>
    </section>
  </div>
</template>
