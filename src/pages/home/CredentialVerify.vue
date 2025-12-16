<template>
  <PageContainer>
    <view class="flex flex-col bg-white h-screen px-4 pt-6 pb-6 overflow-hidden">
      <!-- 标题部分 -->
      <view class="verify-header">
        <view class="header-icon-wrapper">
          <!-- 验证成功：绿色圆圈带白色勾 -->
          <view v-if="allItemsComplete && allItemsSuccess" class="success-icon-bg">
            <view class="success-check-large"></view>
          </view>
          <!-- 验证失败：红色圆圈带白色叉 -->
          <view v-else-if="allItemsComplete && !allItemsSuccess && verifyError" class="error-icon-bg">
            <view class="error-cross-large"></view>
          </view>
          <!-- 验证中：默认图标 -->
          <view v-else class="header-icon">
            <view class="shield-icon"></view>
          </view>
        </view>
        <text class="header-title" :class="headerTitleClass">{{ headerTitle }}</text>
        <!-- 验证失败时的提示文字（API 调用错误时不显示） -->
        <view v-if="allItemsComplete && !allItemsSuccess && verifyError && !isApiError" class="error-tip-wrapper">
          <text class="error-tip-text">请在</text>
          <text class="error-tip-link" @click="handleLaunchMiniProgram">中移可信凭证</text>
          <text class="error-tip-text">重新申请手机号档案凭证后再次尝试</text>
        </view>
      </view>

      <!-- 验证条目列表 -->
      <view class="bg-white rounded-8 shadow-md p-6 mb-4 shrink-0">
        <view class="flex flex-col">
          <view
            v-for="(item, index) in verifyItems"
            :key="index"
            class="flex items-center justify-between py-3 verify-item"
          >
            <view class="text-4 text-gray-900 flex-1 font-normal">{{ item.label }}</view>
            <view class="flex items-center justify-center shrink-0 ml-3 w-10 h-10">
              <!-- 成功状态：绿色圆圈带白色勾 -->
              <view v-if="item.status === 'success'" class="flex items-center justify-center">
                <view class="success-circle">
                  <view class="success-checkmark"></view>
                </view>
              </view>
              <!-- 错误状态：红色圆圈带白色叉 -->
              <view v-else-if="item.status === 'error'" class="flex items-center justify-center">
                <view class="error-circle">
                  <view class="error-cross"></view>
                </view>
              </view>
              <!-- 停止状态：红色圆圈带感叹号 -->
              <view v-else-if="item.status === 'stopped'" class="flex items-center justify-center">
                <view class="stopped-circle">
                  <view class="stopped-exclamation"></view>
                </view>
              </view>
              <!-- 加载中状态：灰色圆形箭头（旋转） -->
              <view v-else-if="item.status === 'loading'" class="flex items-center justify-center">
                <view class="loading-circle">
                  <view class="loading-arrow"></view>
                </view>
              </view>
              <!-- API 错误状态：灰色圆圈（不旋转） -->
              <view v-else-if="item.status === 'api-error'" class="flex items-center justify-center">
                <view class="api-error-circle"></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 验证失败时的取消按钮 -->
      <view v-if="allItemsComplete && !allItemsSuccess && verifyError" class="cancel-button-wrapper">
        <button class="cancel-button" @click="handleCancel">取消</button>
      </view>
    </view>

    <!-- 验证失败跳转提示 Modal -->
    <!-- <up-modal
      :show="showFailModal"
      title="提示"
      :showCancelButton="true"
      cancelText="取消"
      confirmText="确定"
      confirmColor="#db0011"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    >
      <view class="modal-content">
        <text>即将跳转至信息输入界面</text>
      </view>
    </up-modal> -->
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { useVerificationStore, useCredentialStore } from '@/stores';

const verificationStore = useVerificationStore();
const credentialStore = useCredentialStore();

// 从 store 中获取验证状态
const verifyItems = computed(() => verificationStore.verifyItems);
const verifyError = computed(() => verificationStore.verifyError);
const isApiError = computed(() => verificationStore.isApiError);

// 检查是否所有验证项都已完成（成功或失败）
const allItemsComplete = computed(() => {
  return verifyItems.value.every(
    (item) =>
      item.status === 'success' || item.status === 'error' || item.status === 'stopped' || item.status === 'api-error'
  );
});

// 检查是否所有验证项都成功
const allItemsSuccess = computed(() => {
  return verifyItems.value.every((item) => item.status === 'success');
});

// 标题显示
const headerTitle = computed(() => {
  if (allItemsComplete.value && allItemsSuccess.value) {
    return '验证成功';
  } else if (verifyError.value && allItemsComplete.value) {
    return '验证失败';
  }
  return '正在验证';
});

// 标题颜色类
const headerTitleClass = computed(() => {
  if (allItemsComplete.value && allItemsSuccess.value) {
    return 'header-title-success';
  } else if (verifyError.value && allItemsComplete.value) {
    return 'header-title-error';
  }
  return 'header-title-loading';
});

// Modal 显示控制
const showFailModal = ref(false);

// 监听验证失败，显示 modal
watch(
  () => verificationStore.verifyError,
  (error) => {
    if (error && !verificationStore.allVerified) {
      showFailModal.value = true;
    }
  }
);

// 监听验证成功，延迟跳转
watch(
  () => allItemsComplete.value && allItemsSuccess.value,
  (isSuccess) => {
    if (isSuccess) {
      // 验证成功后 2 秒跳转到信息输入页面
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/home/CredentialInfo'
        });
      }, 2000);
    }
  }
);

// /** 处理 Modal 确认按钮 */
// const handleModalConfirm = () => {
//   showFailModal.value = false;
//   uni.redirectTo({
//     url: '/pages/home/CredentialInfo'
//   });
// };

// /** 处理 Modal 取消按钮 */
// const handleModalCancel = () => {
//   showFailModal.value = false;
// };

/** 拉起小程序 */
const handleLaunchMiniProgram = () => {
  credentialStore.launchMiniProgram();
};

/** 处理取消按钮，返回首页 */
const handleCancel = () => {
  uni.reLaunch({
    url: '/pages/home/Index'
  });
};
</script>

<style scoped lang="scss">
// 标题区域样式
.verify-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.header-icon-wrapper {
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.shield-icon {
  width: 36rpx;
  height: 44rpx;
  border: 4rpx solid #ffffff;
  border-radius: 4rpx 4rpx 8rpx 8rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12rpx;
    height: 8rpx;
    border-left: 3rpx solid #ffffff;
    border-bottom: 3rpx solid #ffffff;
    transform: translate(-50%, -60%) rotate(-45deg);
  }
}

.header-title {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
  text-align: center;
}

.header-title-success {
  color: #52c41a;
}

.header-title-error {
  color: #ff4d4f;
}

.header-title-loading {
  color: #333;
}

.header-subtitle {
  font-size: 26rpx;
  color: #999;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
  }
}

// 验证条目边框样式
.verify-item {
  border-bottom: 1rpx solid #f0f0f0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

// 成功状态：绿色圆圈带白色勾
.success-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.success-checkmark {
  width: 20rpx;
  height: 12rpx;
  border-left: 3rpx solid #ffffff;
  border-bottom: 3rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

// 错误状态：红色圆圈带白色叉
.error-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.error-cross {
  width: 20rpx;
  height: 20rpx;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16rpx;
    height: 2rpx;
    background: #ffffff;
    border-radius: 1rpx;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

// 停止状态：红色圆圈带白色感叹号
.stopped-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.stopped-exclamation {
  width: 4rpx;
  height: 20rpx;
  background: #ffffff;
  border-radius: 2rpx;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 4rpx;
    height: 4rpx;
    background: #ffffff;
    border-radius: 50%;
  }
}

// 加载中状态：灰色圆形箭头（旋转）
.loading-circle {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}

.loading-arrow {
  position: absolute;
  top: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6rpx solid transparent;
  border-right: 6rpx solid transparent;
  border-top: 8rpx solid #999999;
}

// API 错误状态：灰色圆圈（不旋转，无箭头）
.api-error-circle {
  width: 40rpx;
  height: 40rpx;
  background: #e5e5e5;
  border-radius: 50%;
}

// 待处理状态：刷新图标（灰色圆形箭头）
.refresh-icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-circle {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.refresh-arrow {
  position: absolute;
  top: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5rpx solid transparent;
  border-right: 5rpx solid transparent;
  border-top: 8rpx solid #999999;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 成功图标背景（用于标题部分）
.success-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(82, 196, 26, 0.3);
  animation: successPop 0.5s ease-out;
}

.success-check-large {
  width: 40rpx;
  height: 20rpx;
  border-left: 5rpx solid #ffffff;
  border-bottom: 5rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -6rpx;
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

// 失败图标背景（用于标题部分）
.error-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 77, 79, 0.3);
  animation: errorPop 0.5s ease-out;
}

.error-cross-large {
  width: 40rpx;
  height: 40rpx;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32rpx;
    height: 4rpx;
    background: #ffffff;
    border-radius: 2rpx;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

// 错误提示容器（用于标题下方）
.error-tip-wrapper {
  margin-top: 24rpx;
  padding: 24rpx 32rpx;
  background: rgba(255, 77, 79, 0.1);
  border: 2rpx solid #ff4d4f;
  border-radius: 12rpx;
  text-align: center;
  line-height: 1.8;
  animation: fadeIn 0.3s ease-out;
}

.error-tip-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.error-tip-link {
  font-size: 28rpx;
  color: #1890ff;
  line-height: 1.8;
  text-decoration: underline;
  text-underline-offset: 2rpx;

  &:active {
    opacity: 0.7;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 取消按钮样式
.cancel-button-wrapper {
  margin-top: 24rpx;
  width: 100%;
}

.cancel-button {
  width: 100%;
  height: 88rpx;
  background: #ff4d4f;
  border: none;
  border-radius: 12rpx;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active {
    background: #ff7875;
    opacity: 0.9;
  }
}

.error-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.error-message {
  font-size: 28rpx;
  color: #ff4d4f;
  text-align: center;
  line-height: 1.6;
}

@keyframes errorPop {
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

// Modal 内容样式
.modal-content {
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

// 验证失败时的底部按钮
.fail-action-button {
  margin-top: 24rpx;
  padding: 0;
}
</style>
