<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';
</script>

<template>
  <ScrollAreaRoot class="relative overflow-hidden" :class="$attrs.class" style="--scrollbar-size: 4px">
    <div class="absolute top-0 z-10 w-full h-6 bg-gradient-to-t" />
    <ScrollAreaViewport class="w-full h-full">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      class="flex select-none touch-none p-0.5 z-20 bg-blackA1 transition-colors duration-[160ms] ease-out hover:bg-blackA2 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      orientation="vertical"
    >
      <ScrollAreaThumb
        class="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
      />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar
      class="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      orientation="horizontal"
    >
      <ScrollAreaThumb
        class="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
      />
    </ScrollAreaScrollbar>

    <div class="absolute bottom-0 z-10 w-full h-6 bg-gradient-to-b from-transparent" />
  </ScrollAreaRoot>
</template>
