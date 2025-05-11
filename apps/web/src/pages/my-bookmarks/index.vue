<script setup lang="ts">
definePageMeta({
  layout: 'bookmark-layout',
});

const { fetchCollection } = useBookmarkApi();
const { data: collectionRes, refresh } = fetchCollection();

const handleRefresh = () => {
  refresh();
};
</script>

<template>
  <div>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">📌 置顶书签</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <BookmarkCard
          v-for="bookmark in collectionRes?.pinnedBookmarks"
          :key="bookmark._id"
          :bookmark="bookmark"
          @bookmark-update="handleRefresh"
        />
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">🕒 最近访问</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <BookmarkCard
          v-for="bookmark in collectionRes?.recentBookmarks"
          :key="bookmark._id"
          :bookmark="bookmark"
          @bookmark-update="handleRefresh"
        />
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">🆕 最近新增</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <BookmarkCard
          v-for="bookmark in collectionRes?.recentAddedBookmarks"
          :key="bookmark._id"
          :bookmark="bookmark"
          @bookmark-update="handleRefresh"
        />
      </div>
    </section>
  </div>
</template>
