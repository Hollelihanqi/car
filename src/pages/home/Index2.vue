<!--
 * @Author: git.name
 * @Date: 2025-12-03 16:57:37
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-09 15:36:52
 * @Description: 
-->
<template>
  <PageContainer>
    <view class="flex flex-col px-10 pt-8 bg-white min-h-screen">
      <!-- <Test /> -->
      <!-- 顶部标题 -->
      <view class="text-5 font-medium text-gray-900 mb-20">开立银行账户</view>

      <!-- 内容区域 -->
      <view class="flex flex-col items-center">
        <!-- 卡片图标 -->
        <view class="mb-12">
          <image src="/static/index_top_icon.png" mode="aspectFit" class="w-50 h-35" />
        </view>

        <!-- 标题 -->
        <view class="text-6 font-bold text-gray-900 mb-6 text-center">进一步验证您的身份</view>

        <!-- 描述文字 -->
        <view class="text-5 text-center leading-11 mb-16">
          请先使用
          <text class="font-semibold">中移可信凭证</text>
          进行手机号核验。
        </view>

        <!-- 确认按钮 -->
        <view class="w-full">
          <up-button class="w-full bg-primary2" type="primary" shape="square" @click="onConfirm">确认</up-button>
        </view>
      </view>
    </view>
  </PageContainer>
  <up-modal
    :show="showModal"
    title="提示"
    confirmText="确认"
    cancelText="取消"
    :showCancelButton="true"
    confirmColor="#db0011"
    @confirm="onConfirmModal"
    @cancel="onCancelModal"
  >
    <view class="flex-wrap">
      <text>请到</text>
      <text class="mx-1 text-primary font-semibold">中移可信凭证</text>
      <text>微信小程序申请手机号凭证。</text>
    </view>
  </up-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores';

const credentialStore = useCredentialStore();

const showModal = ref(false);
const weChatParams = ref('');
const awaitingCredential = ref(false);

const onConfirm = async () => {
  try {
    awaitingCredential.value = true;
    weChatParams.value = '';
    await credentialStore.launchMiniProgram();
  } catch (error) {
    awaitingCredential.value = false;
    console.error('拉起小程序失败:', error);
  }
};

const onConfirmModal = async () => {
  showModal.value = false;
  try {
    awaitingCredential.value = true;
    weChatParams.value = '';
    await credentialStore.launchMiniProgram();
  } catch (error) {
    awaitingCredential.value = false;
    console.error('拉起小程序失败:', error);
  }
};

const onCancelModal = () => {
  showModal.value = false;
};

onShow(async () => {
  // #ifdef APP-PLUS
  const args = plus.runtime.arguments;
  if (!args) {
    awaitingCredential.value = false;
    return;
  }
  if (!awaitingCredential.value && args === weChatParams.value) {
    return;
  }
  awaitingCredential.value = false;
  weChatParams.value = args;
  console.log('回调参数', args);
  const success = await credentialStore.handleCredentialArgs(args);
  if (success) {
    uni.navigateTo({ url: '/pages/home/CredentialInfo' });
  }
  // #endif
});
</script>

<style lang="scss" scoped>
// 暂无额外样式
</style>
