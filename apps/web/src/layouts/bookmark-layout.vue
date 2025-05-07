<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <layout-sidebar />
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <layout-header @add-bookmark="handleAddBookmark" />
      <layout-content :refresh-key="refreshKey">
        <nuxt-page />
      </layout-content>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const refreshKey = ref(0);
const showAddBookmarkForm = ref(false);

function handleAddBookmark() {
  showAddBookmarkForm.value = true;
}
// TODO: handleSubmitBookmark 逻辑迁移
</script>

<style scoped></style>
