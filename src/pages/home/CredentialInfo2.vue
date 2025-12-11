<!--
 * @Author: git.name
 * @Date: 2025-12-04
 * @Description: 手机凭证信息展示页面
-->
<template>
  <PageContainer>
    <view class="credential-container p-4">
      <!-- 凭证主要信息卡片 -->
      <view class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
        <view class="info-item flex flex-col py-1 item-border">
          <text class="text-gray-400 text-sm mb-1">凭证编号</text>
          <text class="font-medium">{{ displayInfo.credentialId || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-1 item-border">
          <text class="text-gray-400 text-sm mb-1">手机号</text>
          <text class="font-medium">{{ displayInfo.phone || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-1 item-border">
          <text class="text-gray-400 text-sm mb-1">姓名</text>
          <text class="font-medium">{{ displayInfo.name || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-1 item-border">
          <text class="text-gray-400 text-sm mb-1">在网时长</text>
          <text class="font-medium">{{ displayInfo.networkDuration || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-1">
          <text class="text-gray-400 text-sm mb-1">签发方</text>
          <text class="font-medium">{{ displayInfo.issuer || '-' }}</text>
        </view>
      </view>

      <!-- 时间信息卡片 -->
      <view class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2 mt-3">
        <view class="info-item flex flex-col py-1 item-border">
          <text class="text-gray-400 text-sm mb-1">凭证有效期限</text>
          <text class="font-medium">{{ displayInfo.validPeriod || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-1 item-border">
          <text class="text-gray-400 text-sm mb-1">凭证签发日期</text>
          <text class="font-medium">{{ displayInfo.issuedDate || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-1">
          <text class="text-gray-400 text-sm mb-1">凭证失效日期</text>
          <text class="font-medium">{{ displayInfo.expiryDate || '-' }}</text>
        </view>
      </view>

      <!-- 确认按钮 -->
      <view class="mt-6">
        <up-button
          class="w-full"
          type="primary"
          shape="circle"
          :loading="loading"
          loadingText="提交中..."
          @click="handleConfirm"
        >
          确认
        </up-button>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores';

const credentialStore = useCredentialStore();
const loading = ref(false);

/** 从对象中提取值 */
const extractValue = (source: Record<string, any> | undefined, keys: string[]): string => {
  if (!source) return '';
  for (const key of keys) {
    if (key in source && source[key]) {
      return source[key];
    }
  }
  return '';
};

/** 展示信息（从 store 计算） */
const displayInfo = computed(() => {
  const credential = credentialStore.credentialInfo;
  const subject = credential?.credentialSubject || {};
  const proof = credential?.proof;

  return {
    credentialId: credential?.id || '-',
    phone: extractValue(subject, ['手机号码', '手机号', 'phone', 'phoneNumber', 'mobile']),
    name: extractValue(subject, ['姓名', 'name', 'fullName']),
    networkDuration: extractValue(subject, ['在网时长', '在网时长']),
    issuer: '中移互联网有限公司',
    validPeriod: '1天',
    issuedDate: proof?.created,
    expiryDate: credential?.validUntil
  };
});

// 确认提交
const handleConfirm = async () => {
  loading.value = true;
  try {
    // 跳转到验证页面
    uni.navigateTo({
      url: '/pages/home/CredentialVerify'
    });
  } catch (error) {
    console.error('跳转失败:', error);
    uni.showToast({
      title: '跳转失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.credential-container {
  min-height: 100%;
  background-color: #f5f5f5;
}

.item-border {
  border-bottom: 1rpx solid #e5e7eb;
}

.success-text {
  color: $uni-color-success;
}
</style>
