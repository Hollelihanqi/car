<template>
  <view class="page-container" :style="{ minHeight: pageHeight + 'px' }">
    <!-- 顶部状态栏占位（可选，如果你的Header是fixed定位，这里需要占位） -->
    <!-- <view :style="{ height: statusBarHeight + 'px' }"></view> -->

    <slot></slot>

    <!-- 底部安全区垫片，防止内容被 iPhone 黑条遮挡 -->
    <view class="safe-area-bottom"></view>
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
  // 关键修改：不要写 overflow-y: auto，也不要写固定 height
  // 使用 min-height 保证内容少时也能铺满背景色
  box-sizing: border-box;
  background-color: #f5f5f5; // 建议设置一个默认背景色
}

// 底部安全区适配
.safe-area-bottom {
  width: 100%;
  height: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  height: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
}
</style>
