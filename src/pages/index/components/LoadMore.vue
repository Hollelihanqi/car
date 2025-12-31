<template>
  <view class="loading-wrapper">
    <view v-if="loading" class="loading-state">
      <text>加载中...</text>
    </view>
    <view v-else-if="!hasMore" class="no-more-state">
      <text>没有更多了</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  hasMore: boolean;
}>();
</script>

<style lang="scss" scoped>
.loading-state,
.no-more-state {
  text-align: center;
  padding: 40rpx 0;
  font-size: 26rpx;
  color: #999;
}
</style>
