<script setup lang="ts">
import type { BookmarkResponse } from '@bookmark/schemas';
definePageMeta({
  layout: 'bookmark-layout',
});
const bookmarks = ref<BookmarkResponse[]>([]);
const { fetchPageList } = useBookmarkApi();
const { data } = await fetchPageList({
  page: 1,
  pageSize: 20,
});

if (data.value && data.value.data) {
  bookmarks.value = data.value.data.content;
}
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
