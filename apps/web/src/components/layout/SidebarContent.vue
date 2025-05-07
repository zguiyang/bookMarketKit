<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { DropdownMenuItem } from '@nuxt/ui';

const router = useRouter();
const route = useRoute();

const colorMode = useColorMode();

const { fetchAllCategories, fetchAllTags } = useBookmarkApi();
const { data: categoriesRes, pending: categoriesLoading } = fetchAllCategories();
const { data: tagsRes, pending: tagsLoading } = fetchAllTags();

const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  },
});

const showAddCategory = ref(false);
const showAddTag = ref(false);

const user = ref({ nickname: 'Joy', email: 'joy@example.com' });

const userMenuItems = ref<DropdownMenuItem[]>([
  [
    {
      label: 'Benjamin',
      avatar: {
        src: 'https://github.com/benjamincanac.png',
      },
      type: 'label',
    },
    {
      label: '切换主题',
      icon: 'i-ph:sun-duotone',
      type: 'button',
      onSelect: () => toggleTheme(),
    },
  ],
  [
    {
      label: '退出登录',
      icon: 'i-ph:sign-out',
      type: 'button',
      color: 'error',
      onSelect: () => handleLogout(),
    },
  ],
]);

function handleViewClick(view?: string) {
  if (view) {
    router.push(`/my-bookmarks/${view}`);
  } else {
    router.push('/my-bookmarks');
  }
}

function handleCategoryClick(cat: any) {
  router.push(`/my-bookmarks/category/${cat.id}`);
}

function handleEditCategory(_cat: any) {
  // TODO: 打开编辑弹窗
}

function handleDeleteCategory(_cat: any) {
  // TODO: 删除分类逻辑
}

function handleTagClick(tag: any) {
  router.push(`/my-bookmarks/tag/${encodeURIComponent(tag.id)}`);
}

function toggleTheme() {
  console.log('🚀 ~ toggleTheme ~ toggleTheme: ', isDark.value);
  isDark.value = !isDark.value; // 切换主题
}

function handleLogout() {
  // TODO: 退出登录逻辑
}
</script>

<template>
  <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
    <!-- Logo 区域 -->
    <div class="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center">
          <!-- SVG 图标 -->
          <svg
            class="h-5 w-5 sm:h-6 sm:w-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-xl font-bold text-gray-900 dark:text-white">BookMarketKit</span>
          <span class="text-[10px] font-medium px-1 py-0.5 rounded-sm bg-primary/15 text-primary">BETA</span>
        </div>
      </div>
    </div>

    <!-- 可滚动内容区域 -->
    <div class="flex-1 overflow-hidden">
      <scroll-area class="w-full h-full">
        <!-- 视图选择区域 -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-4">我的书签</h2>
          <ul class="space-y-1">
            <li
              :class="[
                'flex items-center w-full p-2 rounded-lg text-sm cursor-pointer transition',
                route.path === '/my-bookmarks'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="handleViewClick()">
              <span class="mr-2">✨</span>快捷访问
            </li>
            <li
              :class="[
                'flex items-center w-full p-2 rounded-lg text-sm cursor-pointer transition',
                route.path === '/my-bookmarks/all'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="handleViewClick('all')">
              <span class="mr-2">🔖</span>所有书签
            </li>
            <li
              :class="[
                'flex items-center w-full p-2 rounded-lg text-sm cursor-pointer transition',
                route.path === '/my-bookmarks/YES'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="handleViewClick('YES')">
              <span class="mr-2">❤️</span>最喜欢的
            </li>
          </ul>
        </div>

        <!-- 分类区域 -->
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">分类</h2>
            <u-button icon="i-ph:plus" size="xs" color="primary" variant="ghost" @click="showAddCategory = true" />
          </div>
          <ul v-if="!categoriesLoading && categoriesRes" class="space-y-1">
            <li
              v-for="cat in categoriesRes"
              :key="cat._id"
              :class="[
                'group flex items-center justify-between p-2 rounded-lg cursor-pointer transition',
                route.path === `/my-bookmarks/category/${cat._id}`
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="handleCategoryClick(cat)">
              <div class="flex items-center">
                <span class="mr-2">{{ cat.icon || '📁' }}</span>
                <span class="text-sm">{{ cat.name }}</span>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <u-button
                  icon="i-ph:pencil"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click.stop="handleEditCategory(cat)" />
                <u-button
                  icon="i-ph:trash"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click.stop="handleDeleteCategory(cat)" />
              </div>
            </li>
          </ul>
          <div v-else-if="categoriesLoading" class="flex justify-center items-center py-4">
            <spinner-loading size="sm" />
          </div>
          <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">暂无分类</div>
        </div>

        <!-- 标签区域 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">标签</h2>
            <u-button icon="i-ph:plus" size="xs" color="primary" variant="ghost" @click="showAddTag = true" />
          </div>
          <div v-if="tagsLoading" class="flex justify-center items-center py-4">
            <spinner-loading size="sm" />
          </div>
          <div v-else-if="!tagsRes || tagsRes.length < 1" class="text-center py-4 text-gray-500 dark:text-gray-400">
            暂无标签
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <span
              v-for="tag in tagsRes"
              :key="tag._id"
              class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-white cursor-pointer transition-colors duration-200"
              :style="{ backgroundColor: tag.color }"
              @click="handleTagClick(tag)">
              # {{ tag.name }}
            </span>
          </div>
        </div>
      </scroll-area>
    </div>

    <!-- 用户信息区域 -->
    <div class="flex-none p-3 border-t border-gray-200 dark:border-gray-700">
      <u-dropdown-menu
        :items="userMenuItems"
        :ui="{
          content: 'w-50',
        }">
        <div
          class="flex items-center w-full space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span class="text-white text-lg font-medium">{{ user.nickname }}</span>
          </div>
          <div class="flex-1 text-left min-w-0 overflow-hidden">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.nickname }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
          </div>
          <u-icon name="i-gravity-ui-chevron-up" class="size-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        </div>
      </u-dropdown-menu>
    </div>
  </aside>
</template>
