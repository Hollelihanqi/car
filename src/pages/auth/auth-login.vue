<template>
  <view class="min-h-screen px-8 pt-16 pb-10 bg-gray-100 box-border">
    <view class="flex flex-col items-center mb-12">
      <image src="/static/logo.svg" mode="aspectFit" class="w-[200px] h-[200px]" />
    </view>

    <view class="text-center mb-12">
      <text class="block text-2xl font-bold text-gray-800 mb-2">授权登录</text>
      <text class="block text-sm text-gray-400">请选择账号申请方式</text>
    </view>

    <view class="!flex flex-col gap-4">
      <van-button type="primary" block @click="handleApplyByVc">申请账号（VC）</van-button>
      <van-button type="primary" block @click="handleApplyByApi">申请账号（接口）</van-button>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleApplyByApi = () => {
  uni.navigateTo({
    url: '/pages/auth/apply-account-api'
  });
};

const handleApplyByVc = () => {
  uni.navigateTo({
    url: '/pages/auth/vc-loading'
  });
};
</script>

<style lang="scss" scoped></style>
