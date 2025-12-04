<template>
  <view class="page-container" :style="{ height: pageHeight + 'px' }">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { usePageHeight } from '@/hooks/usePageHeight';

const { pageHeight } = usePageHeight();
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
