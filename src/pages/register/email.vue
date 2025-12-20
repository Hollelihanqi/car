<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 10:47:54
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="page-title">现在开始申请，请提供您的电子邮箱</view>
    <view class="px-[32rpx] mt-[50rpx]">
      <view class="text-[#666]">电子邮箱</view>
      <input v-model="emailValue" class="form-input" @blur="validateEmail" />
      <view v-if="errorText" class="error-tip">
        <view class="error-icon-wrapper">
          <up-icon name="info-circle" size="20" color="#fff"></up-icon>
        </view>
        <text class="error-text">{{ errorText }}</text>
      </view>
    </view>
    <!-- 按钮 -->
    <view class="submit-footer">
      <view class="submit-button" @click="toStepNext">
        <text class="submit-button-text">继续</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';
const emailValue = ref('');
const errorText = ref('');
// 验证邮箱
const validateEmail = () => {
  const email = emailValue.value;
  if (!email) {
    errorText.value = '请输入有效的电子邮箱。';
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errorText.value = '请输入有效的电子邮箱。';
  } else {
    errorText.value = '';
  }
};
const toStepNext = () => {
  validateEmail();
  if (errorText.value) return;
  uni.navigateTo({
    url: '/pages/register/verifyMobile'
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #fff;
  padding-top: 98rpx;
  padding-bottom: 100rpx;
}

.page-title {
  padding: 0rpx 32rpx;
  padding-top: calc(50rpx + var(--status-bar-height));
  font-size: 50rpx;
  font-weight: 600;
}

.banner-image {
  width: 100%;
  height: 200px;
  padding-top: 60rpx;
  background-color: #fff;
  margin-bottom: 30rpx;
}
// 提交按钮 Footer
.submit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 32rpx;
  background: #fff;
  box-sizing: border-box;
  z-index: 100;
  padding-bottom: 30rpx;
}

.submit-button {
  width: 100%;
  height: 45px;
  background: #db0011;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #db0011;
}

.submit-button-text {
  font-size: 30rpx;
  color: #fff;
}
.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background: transparent;
  border-bottom: 1rpx solid #767676;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}
.error-tip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
  padding: 12rpx 16rpx;
  background: #fff5f5;
  border: 1rpx solid #ff6b6b;
  border-left: 4rpx solid #ff6b6b;
}

.error-icon-wrapper {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #ff9800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-text {
  font-size: 24rpx;
  color: #ff6b6b;
  flex: 1;
}
</style>
