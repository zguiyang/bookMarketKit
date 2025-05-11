<script setup lang="ts">
definePageMeta({
  layout: 'bookmark-layout',
});

const { fetchPageList } = useBookmarkApi();
const { data: bookmarkRes, refresh } = await fetchPageList({
  page: 1,
  pageSize: 20,
});

const handleRefresh = () => {
  refresh();
};
</script>

<template>
  <div>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">📚 所有书签</h2>
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
