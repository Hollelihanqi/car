<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-19 16:47:26
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="thanks">感谢您选择汇丰</view>
    <!-- 图片 -->
    <image src="/static/bg2.png" class="banner-image" mode="aspectFill"></image>
    <!-- 文字描述 -->
    <view class="px-[32rpx] text-[30rpx]">
      <view>
        <view class="text-[44rpx]">开户申请现在开始，您目前身处的地方是？</view>
        <view>
          <view class="text-[#666] mt-[30rpx]">国家 / 地区</view>
          <view class="flex justify-between mt-[10rpx] border-0 border-b border-solid border-black pb-[10rpx]">
            <view>香港特别行政区</view>
            <view><up-icon name="arrow-down" /></view>
          </view>

          <view class="mt-[30rpx] underline">找不到您的国家 / 地区？</view>
        </view>
      </view>
      <view>
        <view class="text-[44rpx] mt-[30rpx]">您是否持有香港身份证？</view>
        <view>
          <up-radio-group v-model="radioValue" placement="row" size="30" iconSize="24">
            <up-radio activeColor="red" label="是" name="1"></up-radio>
            <up-radio activeColor="red" label="否" name="2"></up-radio>
          </up-radio-group>
        </view>
        <view class="p-[30rpx] bg-[#eee] mt-[30rpx] flex justify-between gap-[30rpx]">
          <view>没有香港身份证？您也可使用其他身份证明文件开立账户</view>
          <view><up-icon name="arrow-down" size="20" class="mt-[4rpx]" /></view>
        </view>
      </view>
    </view>
    <!-- 按钮 -->
    <view class="submit-footer">
      <view class="submit-button" @click="toStepNext">
        <text class="submit-button-text">确认</text>
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
    url: '/pages/register/condition'
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

.thanks {
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
</style>
