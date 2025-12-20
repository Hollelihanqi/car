<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-19 17:52:39
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="page-title">您是否有活动二维码？</view>
    <view class="px-[32rpx] mt-[50rpx]">
      <up-radio-group v-model="radioValue" placement="column" size="24" iconSize="18">
        <up-radio activeColor="red" label='如有,请点选"继续"以扫描活动二维码。' name="1"></up-radio>
        <up-radio class="mt-[30rpx]" activeColor="red" label='如没有,请点选"继续"以继续申请。' name="2"></up-radio>
      </up-radio-group>
    </view>
    <!-- 按钮 -->
    <view class="submit-footer">
      <view class="submit-button" @click="toStepNext">
        <text class="submit-button-text">继续</text>
      </view>
      <view class="submit-button-default" @click="onBack">
        <text class="submit-button-default-text">返回</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';
const radioValue = ref('2');
const toStepNext = () => {
  uni.navigateTo({
    url: '/pages/register/email'
  });
};
const onBack = () => {
  uni.navigateBack();
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
.submit-button-default {
  width: 100%;
  height: 45px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #333;
  margin-top: 30rpx;
}
.submit-button-default-text {
  font-size: 30rpx;
  color: #333;
  // font-weight: 500;
}
</style>
