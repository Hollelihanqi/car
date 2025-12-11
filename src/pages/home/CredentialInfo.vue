<!--
 * @Author: git.name
 * @Date: 2025-12-04
 * @Description: 手机凭证信息展示页面 - 改为表单输入页面
-->
<template>
  <PageContainer>
    <view class="credential-container p-4">
      <!-- 顶部提示卡片 - 固定显示 -->
      <view class="tip-card bg-white rounded-lg p-4 shadow-sm mb-4 sticky-tip" @click="handleLaunchMiniProgram">
        <view class="tip-content">
          <u-icon name="info-circle" size="18" color="#1890ff"></u-icon>
          <text class="tip-text">前往</text>
          <text class="tip-highlight">中移可信凭证</text>
          <text class="tip-link">申请手机号档案凭证</text>
          <u-icon name="arrow-rightward" size="20" color="#999" class="tip-arrow"></u-icon>
        </view>
      </view>
      <!-- 凭证主要信息卡片 -->
      <view class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
        <view v-if="isVerified" class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">凭证编号</text>
          <input v-model="formData.credentialId" type="text" class="form-input" placeholder="凭证编号" />
        </view>
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">
            <text class="required-star">*</text>
            手机号
          </text>
          <input v-model="formData.phone" type="text" class="form-input" placeholder="请输入手机号" />
        </view>
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">
            <text class="required-star">*</text>
            姓名
          </text>
          <input v-model="formData.name" type="text" class="form-input" placeholder="请输入姓名" />
        </view>
        <view class="info-item flex flex-row items-center py-1" :class="{ 'item-border': isVerified }">
          <text class="form-label">
            <text class="required-star">*</text>
            在网时长
          </text>
          <input v-model="formData.networkDuration" type="text" class="form-input" placeholder="请输入在网时长" />
        </view>
        <view v-if="isVerified" class="info-item flex flex-row items-center py-1">
          <text class="form-label">签发方</text>
          <input v-model="formData.issuer" type="text" class="form-input" placeholder="签发方" />
        </view>
      </view>

      <!-- 时间信息卡片 -->
      <view v-if="isVerified" class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2 mt-3">
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">凭证有效期限</text>
          <input v-model="formData.validPeriod" type="text" class="form-input" placeholder="凭证有效期限" />
        </view>
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">凭证签发日期</text>
          <input v-model="formData.issuedDate" type="text" class="form-input" placeholder="凭证签发日期" />
        </view>
        <view class="info-item flex flex-row items-center py-1">
          <text class="form-label">凭证失效日期</text>
          <input v-model="formData.expiryDate" type="text" class="form-input" placeholder="凭证失效日期" />
        </view>
      </view>

      <!-- 确认按钮 - 只在验证失败时显示 -->
      <view v-if="!isVerified" class="mt-6 pb-safe">
        <up-button
          class="w-full"
          type="primary"
          shape="circle"
          :loading="loading"
          :disabled="!isFormValid"
          loadingText="提交中..."
          @click="handleConfirm"
        >
          确认提交
        </up-button>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores';

const credentialStore = useCredentialStore();
const loading = ref(false);

// 表单数据
const formData = ref({
  credentialId: '',
  phone: '',
  name: '',
  networkDuration: '',
  issuer: '',
  validPeriod: '',
  issuedDate: '',
  expiryDate: ''
});

// 验证状态 - 直接使用 store 中的 isVerified
const isVerified = computed(() => credentialStore.isVerified);

/** 从对象中提取值 */
const extractValue = (source: Record<string, any> | undefined, keys: string[]): string => {
  if (!source) return '';
  for (const key of keys) {
    if (key in source && source[key]) {
      return String(source[key]);
    }
  }
  return '';
};

// 表单验证
const isFormValid = computed(() => {
  return formData.value.phone && formData.value.name && formData.value.networkDuration;
});

// 拉起小程序申请凭证
const handleLaunchMiniProgram = () => {
  // 重置数据和状态
  credentialStore.clearCredential();

  // 重置表单数据
  formData.value = {
    credentialId: '',
    phone: '',
    name: '',
    networkDuration: '',
    issuer: '',
    validPeriod: '',
    issuedDate: '',
    expiryDate: ''
  };

  // 跳转到加载页面，传递回调函数
  uni.navigateTo({
    url: '/pages/home/CredentialLoading'
  });
};

// 页面加载时自动填充数据
onMounted(() => {
  const credential = credentialStore.credentialInfo;
  if (credential && isVerified.value) {
    const subject = credential.credentialSubject || {};
    const proof = credential.proof;

    formData.value.credentialId = credential.id || '';
    formData.value.phone = extractValue(subject, ['手机号码', '手機號', 'phone', 'phoneNumber', 'mobile']);
    formData.value.name = extractValue(subject, ['姓名', 'name', 'fullName']);
    formData.value.networkDuration = extractValue(subject, ['在网时长', '在網時長', 'networkDuration']);
    formData.value.issuer = '中移互联网有限公司';
    formData.value.validPeriod = '1天';
    formData.value.issuedDate = proof?.created || '';
    formData.value.expiryDate = credential.validUntil || '';
  }
});

// 確認提交
const handleConfirm = async () => {
  if (!isFormValid.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }

  loading.value = true;
  try {
    // 这里可以添加提交逻辑
    console.log('提交数据:', formData.value);

    uni.showToast({
      title: '提交成功',
      icon: 'success'
    });

    // 提交成功后可以跳转或返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error('提交失败:', error);
    uni.showToast({
      title: '提交失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.credential-container {
  min-height: 100%;
  background-color: #f5f5f5;
}

.tip-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
}

.sticky-tip {
  position: sticky;
  top: 0;
  z-index: 100;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-wrap: nowrap;
}

.tip-arrow {
  margin-left: auto;
  flex-shrink: 0;
}

.tip-text {
  font-size: 26rpx;
  color: #666;
}

.tip-highlight {
  font-size: 26rpx;
  color: #1890ff;
  font-weight: 500;
}

.tip-link {
  font-size: 26rpx;
  color: #db0011;
  font-weight: 500;
}

.pb-safe {
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.info-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-border {
  border-bottom: 1rpx solid #e5e7eb;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 400;
  flex-shrink: 0;
  width: 200rpx;
}

.required-star {
  color: #db0011;
  font-weight: bold;
}

.form-input {
  flex: 1;
  height: 80rpx;
  padding: 0 24rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #000;
  font-weight: 500;

  &:disabled {
    color: #999;
  }
}

.status-tip {
  padding: 20rpx;
  border-radius: 8rpx;
  text-align: center;
}

.success-tip {
  color: #52c41a;
  font-size: 26rpx;
}

.fail-tip {
  color: #ff4d4f;
  font-size: 26rpx;
}
</style>
