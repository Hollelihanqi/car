<!--
 * @Author: git.name
 * @Date: 2025-12-04
 * @Description: 手機憑證信息展示頁面
-->
<template>
  <PageContainer>
    <view class="credential-container p-6">
      <!-- 標題 -->
      <view class="text-center mb-8">
        <view class="text-xl font-bold mt-4 success-text">授權成功</view>
      </view>

      <!-- 憑證信息卡片 -->
      <view class="bg-white rounded-lg p-6 shadow-sm">
        <view class="info-item flex justify-between py-4 border-b border-gray-100">
          <text class="text-gray-500">手機號</text>
          <text class="font-medium">{{ credentialInfo.phone }}</text>
        </view>
        <view class="info-item flex justify-between py-4 border-b border-gray-100">
          <text class="text-gray-500">姓名</text>
          <text class="font-medium">{{ credentialInfo.name }}</text>
        </view>
        <view class="info-item flex justify-between py-4">
          <text class="text-gray-500">在網時長</text>
          <text class="font-medium">{{ credentialInfo.duration }}</text>
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
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PageContainer from '@/components/PageContainer.vue';

const CREDENTIAL_STORAGE_KEY = 'credentialInfo';

// 憑證信息
const credentialInfo = reactive({
  phone: '',
  name: '',
  duration: ''
});

const loading = ref(false);

const extractValue = (source: Record<string, any> | undefined, keys: string[]) => {
  if (!source) {
    return '';
  }
  for (const key of keys) {
    if (key in source && source[key]) {
      return source[key];
    }
  }
  return '';
};

const loadCredentialFromStorage = () => {
  const cached = uni.getStorageSync(CREDENTIAL_STORAGE_KEY);
  if (!cached || typeof cached !== 'object') {
    credentialInfo.phone = '';
    credentialInfo.name = '';
    credentialInfo.duration = '';
    return;
  }

  const subject = cached.credentialSubject || cached.subject || cached;
  const phoneFromSubject = extractValue(subject, [
    'phone',
    'phoneNumber',
    '手机号',
    '手機號',
    'mobile',
    'mobileNumber'
  ]);
  const nameFromSubject = extractValue(subject, ['name', '姓名', 'fullName']);
  const durationFromSubject = extractValue(subject, ['duration', '在網時長', 'onlineDuration']);

  credentialInfo.phone = cached.phone || phoneFromSubject;
  credentialInfo.name = cached.name || nameFromSubject;
  credentialInfo.duration = cached.duration || durationFromSubject;
};

// 確認提交
const handleConfirm = async () => {
  loading.value = true;
  try {
    // TODO: 調用後端接口
    // const res = await api.submitCredential(credentialInfo);

    // 模擬接口調用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    uni.showToast({
      title: '提交成功',
      icon: 'none'
    });

    // 跳轉到其他頁面或返回首頁
    // setTimeout(() => {
    //   uni.redirectTo({
    //     url: '/pages/home/Index'
    //   });
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

onShow(() => {
  loadCredentialFromStorage();
});
</script>

<style lang="scss" scoped>
.credential-container {
  min-height: 100%;
  background-color: #f5f5f5;
}

.success-text {
  color: $uni-color-success;
}
</style>
