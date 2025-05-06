<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // 尺寸：sm, md, lg，或者直接传递 Tailwind 的 w-h- 类名，例如 'w-12 h-12'
  size?: 'sm' | 'md' | 'lg' | string;
  // 颜色：Tailwind 颜色类名，例如 'text-blue-500'
  color?: string;
  // 边框粗细：Tailwind border-width 类名，例如 'border-2', 'border-4'
  thickness?: string;
  // 旋转速度：Tailwind animation duration 类名，例如 'duration-1000'
  speed?: string;
  // 额外的 CSS 类
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'text-blue-600', // 默认颜色
  thickness: 'border-2',  // 默认粗细
  speed: 'animate-spin',    // 默认使用 Tailwind 的 animate-spin
  class: '',
})

const sizeClasses = computed(() => {
  if (props.size === 'sm') return 'w-4 h-4'
  if (props.size === 'md') return 'w-8 h-8'
  if (props.size === 'lg') return 'w-12 h-12'
  // 如果是自定义字符串，直接使用
  if (typeof props.size === 'string' && (props.size.startsWith('w-') || props.size.startsWith('h-'))) {
    return props.size
  }
  return 'w-8 h-8' // 默认 fallback
})

const spinnerClasses = computed(() => [
  'rounded-full',
  'border-solid',
  'border-current', // 使用当前文本颜色作为边框颜色的一部分
  'border-r-transparent', // 右边框透明，形成旋转效果
  props.speed,
  sizeClasses.value,
  props.color,
  props.thickness,
  props.class, // 允许传入额外的class
])
</script>

<template>
  <div
    role="status"
    :class="spinnerClasses"
    aria-label="Loading..."
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
