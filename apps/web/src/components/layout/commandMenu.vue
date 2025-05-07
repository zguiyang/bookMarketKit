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

const people = [
  { id: 1, label: 'Wade Cooper' },
  { id: 2, label: 'Arlene Mccoy' },
  { id: 3, label: 'Devon Webb' },
  { id: 4, label: 'Tom Cook' },
  { id: 5, label: 'Tanya Fox' },
  { id: 6, label: 'Hellen Schmidt' },
  { id: 7, label: 'Caroline Schultz' },
  { id: 8, label: 'Mason Heaney' },
  { id: 9, label: 'Claudie Smitham' },
  { id: 10, label: 'Emil Schaefer' },
];
const selected = ref([]);
</script>

<template>
  <u-modal>
    <u-button
      label="搜索书签"
      color="neutral"
      variant="subtle"
      class="bg-neutral-100 dark:bg-neutral-600 h-10 justify-start"
      block>
      <u-icon name="i-lucide-search" class="size-4"></u-icon>
      <span class="text-neutral-500 dark:text-neutral-300">搜索书签、标签、关键词...</span>
    </u-button>
    <template #content>
      <u-command-palette
        v-model="selected"
        multiple
        nullable
        label="peoples"
        :groups="[{ id: 'peoples', commands: people }]" />
    </template>
  </u-modal>
</template>

<style scoped lang="scss"></style>
