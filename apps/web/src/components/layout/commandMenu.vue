<script setup lang="ts">
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
  <u-modal>
    <u-button
      label="搜索书签"
      color="neutral"
      variant="subtle"
      class="bg-neutral-100 dark:bg-neutral-600 h-10 justify-start"
      block
    >
      <u-icon name="i-lucide-search" class="size-4"></u-icon>
      <span class="text-neutral-500 dark:text-neutral-300">搜索书签、标签、关键词...</span>
    </u-button>
    <template #content>
      <u-command-palette
        v-model:search-term="keywordRef"
        :loading="status === 'pending'"
        :groups="commandGroups"
        class="h-80"
      />
    </template>
  </u-modal>
</template>

<style scoped lang="scss"></style>
