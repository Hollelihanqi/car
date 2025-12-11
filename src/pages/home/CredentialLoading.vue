<template>
  <PageContainer>
    <view class="loading-container flex flex-col items-center justify-center h-full bg-white">
      <!-- 加载中状态 -->
      <view v-if="!credentialReceived" class="loading-content flex flex-col items-center">
        <view class="loading-icon-wrapper">
          <view class="loading-icon">
            <view class="loading-spinner"></view>
          </view>
        </view>
        <text class="loading-text">正在打开中移可信凭证小程序</text>
        <view class="loading-dots">
          <view class="dot dot1"></view>
          <view class="dot dot2"></view>
          <view class="dot dot3"></view>
        </view>
      </view>

      <!-- 成功状态 -->
      <view v-else class="success-content flex flex-col items-center">
        <view class="success-icon-wrapper">
          <view class="success-icon-bg">
            <view class="success-check"></view>
          </view>
        </view>
        <text class="success-text">已成功获取手机号凭证信息</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores';

const credentialStore = useCredentialStore();
const credentialReceived = ref(false);

// 监听 rawCredential 的变化
const stopWatcher = watch(
  () => credentialStore.rawCredential,
  (newVal) => {
    if (newVal && !credentialReceived.value) {
      credentialReceived.value = true;
    }
  },
  { immediate: true }
);

onMounted(() => {
  // 2秒后拉起小程序
  setTimeout(() => {
    credentialStore.launchMiniProgram();
  }, 2000);
});

onUnmounted(() => {
  // 清理 watcher
  stopWatcher();
});
</script>

<style lang="scss" scoped>
.loading-container {
  min-height: 100vh;
}

.loading-content {
  gap: 32rpx;
}

.loading-icon-wrapper {
  margin-bottom: 16rpx;
}

.loading-icon {
  width: 120rpx;
  height: 120rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 120rpx;
  height: 120rpx;
  border: 6rpx solid #e5e5e5;
  border-top-color: #1890ff;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotate 1s linear infinite;
  aspect-ratio: 1;
}

.loading-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.loading-dots {
  display: flex;
  gap: 12rpx;
  align-items: center;
  margin-top: 8rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #1890ff;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot1 {
  animation-delay: 0s;
}

.dot2 {
  animation-delay: 0.2s;
}

.dot3 {
  animation-delay: 0.4s;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

// 成功状态样式
.success-content {
  gap: 32rpx;
}

.success-icon-wrapper {
  margin-bottom: 16rpx;
}

.success-icon-bg {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(82, 196, 26, 0.3);
  animation: successPop 0.5s ease-out;
}

.success-check {
  width: 60rpx;
  height: 30rpx;
  border-left: 6rpx solid #ffffff;
  border-bottom: 6rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -6rpx;
}

.success-text {
  font-size: 32rpx;
  color: #52c41a;
  font-weight: 500;
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
