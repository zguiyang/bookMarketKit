<script setup lang="ts">
import type { BookmarkResponse } from '@bookmark/schemas';
import { BookmarkFavoriteEnum, BookmarkPinnedEnum } from '@bookmark/schemas';

interface IProps {
  bookmark: BookmarkResponse;
}

withDefaults(defineProps<IProps>(), {});

const emit = defineEmits<{
  (event: 'bookmark-update', bookmark: BookmarkResponse): void;
}>();
const toast = useToast();

const { visited, favorite, pinned } = useBookmarkApi();
const { copied, copy: handleCopy } = useClipboard({
  legacy: true,
});

const handleUpdate = (bookmark: BookmarkResponse) => {
  emit('bookmark-update', bookmark);
};

const handleCopyLink = async (bookmark: BookmarkResponse) => {
  await handleCopy(bookmark.url);
  if (copied.value) {
    toast.add({
      title: '复制成功',
      color: 'success',
    });
  } else {
    toast.add({
      title: '复制失败',
      color: 'error',
    });
  }
};

const handleVisitedBookmark = async (bookmark: BookmarkResponse) => {
  await visited(bookmark._id);
};

const handleFavoriteBookmark = async (bookmark: BookmarkResponse) => {
  await favorite({
    id: bookmark._id,
    favorite: bookmark.isFavorite === BookmarkFavoriteEnum.YES ? BookmarkFavoriteEnum.NO : BookmarkFavoriteEnum.YES,
  });
  handleUpdate(bookmark);
};

const handlePinnedBookmark = async (bookmark: BookmarkResponse) => {
  await pinned({
    id: bookmark._id,
    pinned: bookmark.isPinned === BookmarkPinnedEnum.YES ? BookmarkPinnedEnum.NO : BookmarkPinnedEnum.YES,
  });
  handleUpdate(bookmark);
};
</script>

<template>
  <u-container
    class="group rounded-xl relative overflow-hidden transition-all hover:-translate-y-1 border-gray-100 dark:border-gray-700 sm:p-2 bg-white dark:bg-gray-800"
  >
    <div class="flex items-center justify-between mb-3 sm:mb-2">
      <div class="flex items-center space-x-2 max-w-[70%] sm:max-w-[60%]">
        <div
          v-if="bookmark.icon"
          class="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700"
        >
          <img :src="bookmark.icon" alt="" class="w-5 h-5 object-contain" />
        </div>
        <h3
          class="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors cursor-pointer"
          :title="bookmark.title"
        >
          <a :href="bookmark.url" target="_blank" @click="handleVisitedBookmark(bookmark)">
            {{ bookmark.title }}
          </a>
        </h3>
      </div>

      <!-- 操作按钮组 -->
      <div class="flex items-center space-x-1">
        <u-button
          variant="ghost"
          size="sm"
          :icon="bookmark.isFavorite === BookmarkFavoriteEnum.YES ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          :class="['size-8 sm:size-7', 'cursor-pointer transition-colors', 'text-red-500']"
          square
          @click="handleFavoriteBookmark(bookmark)"
        />
        <u-button
          variant="ghost"
          size="sm"
          :icon="bookmark.isPinned === BookmarkPinnedEnum.YES ? 'i-gravity-ui-pin-slash' : 'i-gravity-ui-pin'"
          class="size-8 sm:size-7 cursor-pointer transition-colors"
          square
          @click="handlePinnedBookmark(bookmark)"
        />

        <u-dropdown-menu
          :items="[
            [
              {
                label: '访问书签',
                icon: 'i-material-symbols-open-in-new',
                onClick: async () => {
                  await navigateTo(bookmark.url, {
                    open: {
                      target: '_blank',
                    },
                  });
                  handleVisitedBookmark(bookmark);
                },
              },
              {
                label: '复制链接',
                icon: 'i-heroicons-link',
                onClick: () => {
                  handleCopyLink(bookmark);
                },
              },
            ],
            [
              {
                label: '编辑',
                icon: 'i-heroicons-pencil-square',
                onClick: () => {
                  console.log('编辑');
                },
              },
              {
                label: '删除',
                icon: 'i-heroicons-trash',
                color: 'error',
                onClick: () => {
                  console.log('删除');
                },
              },
            ],
          ]"
        >
          <u-button
            color="neutral"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal"
            class="size-8 sm:size-7"
            square
          />
        </u-dropdown-menu>
      </div>
    </div>

    <!-- 描述部分 -->
    <div v-if="bookmark.description" class="mb-3">
      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 transition-all duration-200">
        {{ bookmark.description }}
      </p>
    </div>

    <!-- 分类和标签部分 -->
    <div class="flex flex-wrap gap-1.5">
      <template v-for="category in bookmark.categories" :key="category.id">
        <span
          class="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors"
        >
          {{ category.name }}
        </span>
      </template>
      <template v-for="tag in bookmark.tags" :key="tag.id">
        <span
          class="px-2 py-0.5 rounded-md text-xs transition-colors"
          :style="tag.color ? `--dynamic-tag-color:${tag.color}` : ''"
          :class="[
            tag.color
              ? `bg-[var(--dynamic-tag-color)] text-white`
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
          ]"
        >
          # {{ tag.name }}
        </span>
      </template>
    </div>
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
    />
  </u-container>
</template>
