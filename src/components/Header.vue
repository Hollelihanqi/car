<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 10:43:57
 * @Description: 注册页面
-->
<template>
  <view class="header">
    <u-icon class="iconStyle" name="close" size="24" color="#333" @click="onBack"></u-icon>
    <text class="header-title">开立汇丰账户</text>
  </view>
  <up-modal
    class="closeModal"
    width="500rpx"
    showConfirmButton
    confirmText="离开"
    showCancelButton
    cancelText="不离开"
    confirmColor="red"
    :show="show"
    title="您确定要离开此页面吗？"
    content="您所做的所有更改都将丢失。"
    contentTextAlign="center"
    @confirm="onConfirm"
    @cancel="onBack"
  ></up-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const show = ref(false);
const onBack = () => {
  show.value = !show.value;
  // uni.navigateBack();
};
const onConfirm = () => {
  uni.reLaunch({
    url: '/'
  });
};
</script>

<style lang="scss" scoped>
// 顶部导航栏
.header {
  background: #fff;
  padding: 24rpx 0rpx;
  padding-top: calc(24rpx + var(--status-bar-height));

  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  width: 100%;
}

.header-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}
.iconStyle {
  position: absolute;
  top: calc(24rpx + var(--status-bar-height));
  left: 32rpx;
}
.closeModal :deep(.u-line) {
  height: auto !important;
}
</style>
