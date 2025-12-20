<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 16:12:59
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="page-title">您希望使用哪种身份证明文件开立账户</view>
    <view class="px-[32rpx] mt-[50rpx]">
      <up-radio-group v-model="radioValue" placement="column" size="24" iconSize="18">
        <up-radio activeColor="red" label="往来港澳通行证" name="1"></up-radio>
      </up-radio-group>
    </view>
    <view class="px-[32rpx] mt-[50rpx] flex justify-between pb-[20rpx] border-0 border-b border-solid border-[#ccc]">
      <view>身份证明文件未被列出？</view>
      <up-icon name="arrow-down" bold size="24" />
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
    <up-modal :show="showModal" :showConfirmButton="false" title="说明">
      <view class="modal-content">
        <view class="">
          <view class="">此时已通过手机号实名身份凭证获取到用户手机号码和姓名,可继续进行剩下的开户流程;</view>
          <view class="mt-[20rpx]">后续当用户提交有效身份证件资料时, 还可以与手机号实名身份凭证中信息进 行比对。</view>
        </view>
        <view class="mt-[50rpx]">
          <button class="bg-[#db0011] text-white text-[30rpx]" @click="handleCancel">返回上一页</button>
        </view>
      </view>
    </up-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';
const radioValue = ref('1');
const showModal = ref(true);
const toStepNext = () => {
  showModal.value = true;
};
const onBack = () => {
  uni.navigateBack();
};
const handleCancel = () => {
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
