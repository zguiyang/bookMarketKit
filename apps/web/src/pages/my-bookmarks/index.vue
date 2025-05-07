<script setup lang="ts">
definePageMeta({
  layout: 'bookmark-layout',
});

// const { fetchPageList } = useBookmarkApi();
// const { data: bookmarkRes } = await fetchPageList({
//   page: 1,
//   pageSize: 20,
// });
</script>

<template>
  <div class="px-4 py-6">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">📌 置顶书签</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">🕒 最近访问</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">🆕 最近新增</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
    </section>
  </div>
</template>
