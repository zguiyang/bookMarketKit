<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  },
});

const isOpenRef = ref(false);
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpenRef.value = !isOpenRef.value;
    },
  },
  escape: {
    usingInput: true,
    handler: () => {
      isOpenRef.value = false;
    },
  },
});

const { search } = useBookmarkApi();
const keywordRef = ref('a');
const { data: searchResult, status } = useAsyncData('command-search', () => search({ keyword: keywordRef.value }), {
  watch: [keywordRef],
  transform: (res) => {
    return res.data;
  },
});

const commandGroups = computed(() => {
  return [
    {
      label: '书签',
      id: 'bookmarks',
      items: searchResult.value?.bookmarks?.map((bookmark) => ({
        id: bookmark._id,
        label: bookmark.title,
        to: bookmark.url,
        target: '_blank',
        avatar: { src: bookmark.icon },
      })),
    },
    {
      label: '分类',
      id: 'categories',
      items: searchResult.value?.categories?.map((cat) => ({
        id: cat._id,
        label: cat.name,
      })),
    },
    {
      label: '标签',
      id: 'tags',
      items: searchResult.value?.tags?.map((tag) => ({
        id: tag._id,
        label: tag.name,
      })),
    },
  ];
});
</script>

<template>
  <u-modal v-model:open="isOpenRef">
    <u-button
      label="搜索书签"
      color="neutral"
      variant="subtle"
      icon="i-lucide-search"
      class="bg-neutral-100 dark:bg-neutral-600 h-10 justify-start"
      block
    >
      <span class="text-neutral-500 dark:text-neutral-300">搜索书签、标签、关键词...</span>
      <u-kbd value="meta"></u-kbd>
      <u-kbd value="K"></u-kbd>
    </u-button>
    <template #content>
      <u-command-palette
        v-model:search-term="keywordRef"
        :loading="status === 'pending'"
        :groups="[
          ...commandGroups,
          {
            label: '操作',
            id: 'actions',
            items: [
              {
                id: 'dark-mode',
                label: '切换主题',
                icon: isDark ? 'i-lucide-sun' : 'i-lucide-moon',
                onSelect: () => {
                  isDark = !isDark;
                },
              },
            ],
          },
        ]"
        placeholder="请输入任意关键字搜索书签、标签等"
        loading-icon="i-uiw-loading"
        :fuse="{
          fuseOptions: { includeMatches: true },
          resultLimit: 50,
        }"
        class="h-80"
      >
        <template #empty="{ searchTerm }">
          <div v-if="searchTerm" class="text-center text-neutral-500 dark:text-neutral-300">
            没有找到与 <span class="font-medium">{{ searchTerm }}</span> 相关的项
          </div>
          <div v-else class="text-center text-neutral-500 dark:text-neutral-300">
            请输入关键字搜索，如：GitHub、Google等
          </div>
        </template>
      </u-command-palette>
    </template>
  </u-modal>
</template>

<style scoped lang="scss"></style>
