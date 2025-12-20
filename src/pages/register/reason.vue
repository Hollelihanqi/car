<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 10:48:10
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="page-title">您在香港开立账户的原因是？</view>
    <view class="px-[32rpx] mt-[40rpx]">
      <up-cell-group>
        <up-cell
          v-for="item in reasonList"
          :key="item"
          size="large"
          :title="item"
          isLink
          :titleStyle="{
            fontSize: '30rpx',
            paddingTop: '16rpx',
            paddingBottom: '16rpx'
            // paddingLeft: '16rpx'
          }"
          @click="toStepNext"
        ></up-cell>
      </up-cell-group>
    </view>

    <!-- 按钮 -->
    <view class="px-[32rpx] mt-[80rpx] text-[30rpx]">
      <view class="flex w-2/5 items-center gap-[20rpx]" @click="onBackStep">
        <view><up-icon name="arrow-left" size="24" bold color="#db0011" /></view>
        <view>返回</view>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';

const reasonList = ref([
  '准备在6个月内到香港工作',
  '准备在6个月内到香港读书',
  '打算在香港储蓄/投资',
  '打算于6个月内在香港置业',
  '在香港因出租物业而收取租金',
  '准备在6个月内移居至香港',
  '经常到香港工作',
  '经常到香港度假',
  '其他'
]);
const toStepNext = () => {
  uni.navigateTo({
    url: '/pages/register/qrCode'
  });
};
const onBackStep = () => {
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

// 提交按钮 Footer
.submit-footer {
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
</style>
