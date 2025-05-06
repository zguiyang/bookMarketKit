<script setup lang="ts">
defineEmits(['add-bookmark'])
</script>

<template>
  <div class="border-b border-b-gray-200 dark:border-b-gray-700 bg-white dark:bg-gray-900">
    <div class="flex h-16 items-center px-4 md:px-8">
      <div class="md:hidden">
       <u-icon name="i-gravity-ui-text-align-justify" class="size-6"></u-icon>
      </div>
      <div class="flex-1 flex items-center space-x-4">
        <div class="flex-1 relative">
          <layout-command-menu />
        </div>
        <u-button icon="i-gravity-ui-plus" class="btn" size="lg" @click="$emit('add-bookmark')">
          <span>新增书签</span>
        </u-button>
      </div>
    </div>
  </div>
</template>