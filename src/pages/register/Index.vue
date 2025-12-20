<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-19 17:48:09
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 图片 -->
    <image src="/static/bg1.png" class="banner-image" mode="aspectFill"></image>
    <!-- 文字描述 -->
    <view class="text-[30rpx]">
      <view class="title">欢迎使用香港汇丰流动理财</view>
      <view class="text">如您已持有汇丰账户或信用卡,请登录以继续使用。</view>
      <view class="text">如您仍未持有任何汇丰账户,您可立即开立账户以享 受简单方便的流动理财体验。</view>
    </view>
    <!-- 按钮 -->
    <view class="submit-footer">
      <view class="submit-button">
        <text class="submit-button-text">立即登录</text>
      </view>
      <view class="submit-button-default" @click="toRegister">
        <text class="submit-button-default-text">我没有任何账户</text>
      </view>
      <view class="submit-button-link">
        <text class="submit-button-link-text">我有参考编号</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';

const toRegister = () => {
  uni.navigateTo({
    url: '/pages/register/stepOne'
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
}
.title {
  padding: 0rpx 32rpx;
  font-size: 44rpx;
  padding-top: 50rpx;
}

.text {
  font-size: 30rpx;
  padding: 0rpx 32rpx;
  margin-top: 30rpx;
}
.banner-image {
  width: 100%;
  height: 250px;
  padding-top: calc(60rpx + var(--status-bar-height));
  // height: 100rpx;
  // width: 100%;
  background-color: #ededed;
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

.submit-button-text {
  font-size: 30rpx;
  color: #fff;
  // font-weight: 600;
}
.submit-button-default-text {
  font-size: 30rpx;
  color: #333;
  // font-weight: 500;
}
.submit-button-link {
  width: 100%;
  height: 45px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
.submit-button-link-text {
  font-size: 30rpx;
  color: #333;
  // font-weight: 600;
  text-decoration: underline;
}
</style>
