<template>
  <PageContainer>
    <view class="loading-container flex flex-col items-center justify-center h-full">
      <!-- 加载中状态 -->
      <view v-if="!credentialReceived" class="loading-content flex flex-col items-center">
        <!-- 主图标区域 -->
        <view class="icon-container mb-8">
          <view class="loading-icon-wrapper">
            <view class="loading-spinner"></view>
            <view class="loading-spinner-inner"></view>
          </view>
        </view>

        <!-- 标题文字 -->
        <text class="loading-title">正在打开中移可信凭证小程序</text>

        <!-- 进度提示 -->
        <view class="progress-hint mt-4">
          <view class="progress-dot"></view>
          <view class="progress-dot"></view>
          <view class="progress-dot"></view>
        </view>
      </view>

      <!-- 成功状态 -->
      <view v-else class="success-content flex flex-col items-center">
        <!-- 成功图标 -->
        <view class="icon-container mb-8">
          <view class="success-icon-wrapper">
            <view class="success-icon-bg">
              <view class="success-check"></view>
            </view>
            <view class="success-ripple"></view>
            <view class="success-ripple success-ripple-delay"></view>
          </view>
        </view>

        <!-- 成功标题 -->
        <text class="success-title">已成功获取手机号档案凭证</text>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 40rpx;
}

.loading-content {
  gap: 0;
}

.icon-container {
  position: relative;
}

// 加载状态样式
.loading-icon-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 160rpx;
  height: 160rpx;
  border: 8rpx solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-right-color: #ffffff;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotate 1.2s linear infinite;
  position: absolute;
}

.loading-spinner-inner {
  width: 120rpx;
  height: 120rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.15);
  border-bottom-color: #ffffff;
  border-left-color: #ffffff;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotateReverse 1s linear infinite;
  position: absolute;
}

.loading-title {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  letter-spacing: 1rpx;
}

.progress-hint {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: center;
}

.progress-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: dotPulse 1.4s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

.loading-tip {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

// 成功状态样式
.success-content {
  gap: 0;
}

.success-icon-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon-bg {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(82, 196, 26, 0.4);
  position: relative;
  z-index: 2;
  animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-check {
  width: 70rpx;
  height: 40rpx;
  border-left: 8rpx solid #ffffff;
  border-bottom: 8rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -8rpx;
  margin-left: -4rpx;
}

.success-ripple {
  position: absolute;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(82, 196, 26, 0.4);
  animation: ripple 2s ease-out infinite;
  z-index: 1;
}

.success-ripple-delay {
  animation-delay: 1s;
}

.success-title {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  letter-spacing: 1rpx;
}

.success-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
}

// 动画定义
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotateReverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>
