<!--
 * @Author: git.name
 * @Date: 2025-12-04
 * @Description: 手機憑證信息展示頁面
-->
<template>
  <PageContainer>
    <view class="credential-container p-4">
      <!-- 憑證信息卡片 -->
      <view class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4">
        <view class="info-item flex flex-col py-2 item-border">
          <text class="text-gray-400 text-sm mb-1">手機號</text>
          <text class="font-medium">{{ displayInfo.phone || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-2 item-border">
          <text class="text-gray-400 text-sm mb-1">姓名</text>
          <text class="font-medium">{{ displayInfo.name || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-2 item-border">
          <text class="text-gray-400 text-sm mb-1">在網時長</text>
          <text class="font-medium">{{ displayInfo.networkDuration || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-2 item-border">
          <text class="text-gray-400 text-sm mb-1">移動驗證流水號</text>
          <text class="font-medium text-sm break-all">{{ displayInfo.verifySerialNo || '-' }}</text>
        </view>
        <view class="info-item flex flex-col py-2">
          <text class="text-gray-400 text-sm mb-1">移動驗證時間戳</text>
          <text class="font-medium">{{ displayInfo.verifyTimestamp || '-' }}</text>
        </view>
      </view>

      <!-- 確認按鈕 -->
      <view class="mt-8">
        <up-button
          class="w-full"
          type="primary"
          shape="circle"
          :loading="loading"
          loadingText="提交中..."
          @click="handleConfirm"
        >
          確認
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

/** 格式化时间戳（毫秒级时间戳转日期时间） */
const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return '-';
  try {
    const ts = Number(timestamp);
    if (isNaN(ts)) return timestamp;
    const date = new Date(ts);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return timestamp;
  }
};

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
  // 新数据结构：credentialSubject 直接在 credential 下，无 encryptedVc 包装
  const subject = credential?.credentialSubject || {};

  const rawTimestamp = extractValue(subject, ['移动验证时间戳', '移動驗證時間戳']);

  return {
    phone: extractValue(subject, ['手机号', '手機號', 'phone', 'phoneNumber', 'mobile']),
    name: extractValue(subject, ['姓名', 'name', 'fullName']),
    // 在网时长、移动验证流水号、移动验证时间戳 都在 credentialSubject 中
    networkDuration: extractValue(subject, ['在网时长', '在網時長']),
    verifySerialNo: extractValue(subject, ['移动验证流水号', '移動驗證流水號']),
    verifyTimestamp: formatTimestamp(rawTimestamp)
  };
});

// 確認提交
const handleConfirm = async () => {
  loading.value = true;
  try {
    // TODO: 調用後端接口
    // const res = await api.submitCredential(credentialStore.credentialInfo);

    // 模擬接口調用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    uni.showToast({
      title: '提交成功',
      icon: 'none'
    });

    // 清除凭证并返回首页
    // credentialStore.clearCredential();
    // setTimeout(() => {
    //   uni.redirectTo({ url: '/pages/home/Index' });
    // }, 1500);
  } catch {
    uni.showToast({
      title: '提交失敗，請重試',
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
