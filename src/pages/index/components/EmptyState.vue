<template>
  <view class="empty-state">
    <text class="empty-icon">🚗</text>
    <text class="empty-text">暂无拼车信息</text>
    <text class="empty-hint">快去发布一条吧~</text>
  </view>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #999;
  }
}
</style>
