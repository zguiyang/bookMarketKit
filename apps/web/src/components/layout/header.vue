<script setup lang="ts"></script>

<template>
  <div class="border-b border-b-gray-200 dark:border-b-gray-700 bg-white dark:bg-gray-900">
    <div class="flex items-center px-4 md:px-8 py-2 md:py-4 space-x-4 sm:space-x-2">
      <!-- 移动端侧边栏 -->
      <u-drawer direction="left" :handle="false">
        <div class="md:hidden">
          <u-icon name="i-gravity-ui-text-align-justify" class="size-6 block"></u-icon>
        </div>
        <template #content>
          <layout-sidebar-content />
        </template>
      </u-drawer>
      <div class="flex-1 flex items-center space-x-4 sm:space-x-2">
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
