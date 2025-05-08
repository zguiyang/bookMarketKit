<script setup lang="ts">
import { BookmarkFavoriteEnum } from '@bookmark/schemas';
definePageMeta({
  layout: 'bookmark-layout',
});

const { fetchPageList } = useBookmarkApi();
const { data: bookmarkRes, refresh } = await fetchPageList({
  page: 1,
  pageSize: 20,
  isFavorite: BookmarkFavoriteEnum.YES,
});

const handleRefresh = () => {
  refresh();
};
</script>

<template>
  <div class="px-4 py-6">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">♥️ 最喜欢的</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <bookmark-card
          v-for="bookmark in bookmarkRes?.content ?? []"
          :key="bookmark._id"
          :bookmark="bookmark"
          @bookmark-update="handleRefresh"
        ></bookmark-card>
      </div>
    </section>
  </div>
</template>
