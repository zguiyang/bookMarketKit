<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <layout-sidebar />
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <layout-header @add-bookmark="handleAddBookmark" />
      <layout-content :refresh-key="refreshKey">
        <nuxt-page />
      </layout-content>
      <!-- 书签表单弹窗，TODO: 迁移并适配 -->
      <!-- <BookmarkForm ... /> -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// TODO: 迁移 BookmarkForm 并适配 Nuxt 3

const refreshKey = ref(0)
const showAddBookmarkForm = ref(false)

function handleAddBookmark() {
  showAddBookmarkForm.value = true
}
// TODO: handleSubmitBookmark 逻辑迁移
</script>

<style scoped>
/* 可根据需要补充样式 */
</style> 