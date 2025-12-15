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

      <!-- 验证状态提示 - 显示在顶部提示卡片下方 -->
      <view v-if="!isVerified && verifyStatus !== null" class="verify-status-section">
        <!-- 验证成功提示 -->
        <view v-if="verifyStatus === 'success'" class="verify-status-card success-status">
          <view class="status-icon-wrapper">
            <view class="status-icon success-icon">
              <view class="success-check-large"></view>
            </view>
          </view>
          <text class="status-text">验证成功</text>
        </view>
        <!-- 验证失败提示 -->
        <view v-else-if="verifyStatus === 'error'" class="error-tip-wrapper">
          <text class="error-tip-text">请在</text>
          <text class="error-tip-link" @click="handleLaunchMiniProgram">中移可信凭证</text>
          <text class="error-tip-text">重新申请手机号档案凭证后再次尝试</text>
        </view>
      </view>
      <!-- 凭证主要信息卡片 -->
      <view class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
        <view v-if="isVerified" class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">凭证编号</text>
          <up-input v-model="formData.credentialId" placeholder="" :disabled="true" class="form-input" />
        </view>
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">
            <text class="required-star">*</text>
            手机号
          </text>
          <up-input v-model="formData.phone" placeholder="" :disabled="true" class="form-input" />
        </view>
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">
            <text class="required-star">*</text>
            姓名
          </text>
          <up-input v-model="formData.name" placeholder="" :disabled="true" class="form-input" />
        </view>
        <view class="info-item flex flex-row items-center py-1" :class="{ 'item-border': isVerified }">
          <text class="form-label">
            <text class="required-star">*</text>
            在网时长
          </text>
          <up-input v-model="formData.networkDuration" placeholder="" :disabled="true" class="form-input" />
        </view>
        <view v-if="isVerified" class="info-item flex flex-row items-center py-1">
          <text class="form-label">签发方</text>
          <up-input v-model="formData.issuer" placeholder="" :disabled="true" class="form-input" />
        </view>
      </view>

      <!-- 时间信息卡片 -->
      <view v-if="isVerified" class="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2 mt-3">
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">凭证有效期限</text>
          <up-input v-model="formData.validPeriod" placeholder="" :disabled="true" class="form-input" />
        </view>
        <view class="info-item flex flex-row items-center py-1 item-border">
          <text class="form-label">凭证签发日期</text>
          <up-input v-model="formData.issuedDate" placeholder="" :disabled="true" class="form-input" />
        </view>
        <view class="info-item flex flex-row items-center py-1">
          <text class="form-label">凭证失效日期</text>
          <up-input v-model="formData.expiryDate" placeholder="" :disabled="true" class="form-input" />
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
          提交
        </up-button>
      </view>

      <!-- 提交按钮 - 凭证验证成功，信息已自动填充时显示 -->
      <view v-if="isVerified" class="mt-6 pb-safe">
        <up-button
          class="w-full"
          type="primary"
          shape="circle"
          :loading="loading"
          :disabled="!isFormValid"
          loadingText="提交中..."
          @click="handleSubmit"
        >
          提交
        </up-button>
      </view>
    </view>

    <!-- 账户申请中 Modal -->
    <up-modal
      :show="showApplyModal"
      title="提示"
      :showCancelButton="false"
      confirmText="知道了"
      confirmColor="#db0011"
      @confirm="handleModalConfirm"
    >
      <view class="modal-content">
        <text>申请已提交，正在开立账户。</text>
      </view>
    </up-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores';
import { checkMobile } from '@/api/credential';
import { Base64, Utf8 } from '@/utils/aes';

const credentialStore = useCredentialStore();
const loading = ref(false);

// 验证状态：null-未验证, 'success'-成功, 'error'-失败
const verifyStatus = ref<'success' | 'error' | null>(null);

// Modal 显示控制
const showApplyModal = ref(false);

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

/** 从对象中提取在网时长（支持多种字段名变体） */
const extractNetworkDuration = (source: Record<string, any> | undefined): string => {
  if (!source) return '';

  // 首先尝试精确匹配
  const exactKeys = ['在网时长', '在網時長', 'networkDuration'];
  for (const key of exactKeys) {
    if (key in source && source[key]) {
      return String(source[key]);
    }
  }

  // 如果精确匹配失败，查找以"在网时长"开头的字段
  for (const key in source) {
    if (key.startsWith('在网时长') || key.startsWith('在網時長')) {
      const value = source[key];
      if (value) {
        return String(value);
      }
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
  setTimeout(() => {
    credentialStore.clearCredential();
  }, 1000);

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
  uni.redirectTo({
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
    formData.value.networkDuration = extractNetworkDuration(subject);
    formData.value.issuer = '中移互联网有限公司';
    formData.value.validPeriod = '1天';
    formData.value.issuedDate = proof?.created || '';
    formData.value.expiryDate = credential.validUntil || '';
  }
});

/** Base64 加密 */
const encryptBase64 = (str: string): string => {
  // 使用项目中的 Base64 编码器：先将字符串转为 WordArray，再转为 Base64
  return Base64.stringify(Utf8.parse(str));
};

// 确认提交
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
    // 加密手机号和姓名
    const encryptedMobile = encryptBase64(formData.value.phone);
    const encryptedName = encryptBase64(formData.value.name);

    console.log('提交数据:', {
      mobile: encryptedMobile,
      name: encryptedName
    });

    // 调用手机号验证接口
    const result = await checkMobile({
      mobile: encryptedMobile,
      name: encryptedName
    });

    console.log('验证结果:', result);

    // 处理返回结果
    if (result.code === '000000') {
      // 验证成功，更新在网时长
      if (result.onlineDuration) {
        formData.value.networkDuration = result.onlineDuration;
      }

      // 根据 authStatus 判断是否一致
      if (result.authStatus === 1) {
        // 信息一致，验证成功
        verifyStatus.value = 'success';
        uni.showToast({
          title: '验证成功',
          icon: 'success'
        });

        // 提交成功后可以跳转或返回
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        // 信息不一致，验证失败
        verifyStatus.value = 'error';
        uni.showToast({
          title: '信息不一致',
          icon: 'none'
        });
      }
    } else {
      // 验证失败
      verifyStatus.value = 'error';
      uni.showToast({
        title: result.desc || '验证失败',
        icon: 'none'
      });
    }
  } catch (error: any) {
    console.error('提交失败:', error);
    verifyStatus.value = 'error';
    uni.showToast({
      title: error.message || '提交失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 提交按钮 - 凭证验证成功，信息已自动填充时调用
const handleSubmit = async () => {
  showApplyModal.value = true;
};

// Modal 确认按钮处理
const handleModalConfirm = () => {
  showApplyModal.value = false;
  uni.reLaunch({
    url: '/pages/home/Index'
  });
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

  // up-input 组件样式覆盖
  :deep(.up-input) {
    height: 80rpx;
    font-size: 28rpx;
    color: #000;
    font-weight: 500;
  }

  :deep(.up-input__input) {
    font-size: 28rpx;
    color: #000;
    font-weight: 500;
  }

  :deep(.up-input--disabled) {
    .up-input__input {
      color: #999;
    }
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

// 验证状态区域
.verify-status-section {
  margin-bottom: 24rpx;
}

// 验证状态卡片
.verify-status-card {
  padding: 32rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  animation: fadeIn 0.3s ease-out;
}

.success-status {
  background: rgba(82, 196, 26, 0.1);
  border: 2rpx solid #52c41a;
}

.status-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  background: #52c41a;
}

.success-check-large {
  width: 32rpx;
  height: 18rpx;
  border-left: 4rpx solid #ffffff;
  border-bottom: 4rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

.status-text {
  font-size: 32rpx;
  font-weight: 500;
}

.success-status .status-text {
  color: #52c41a;
}

// 错误提示容器
.error-tip-wrapper {
  padding: 24rpx 32rpx;
  background: rgba(255, 77, 79, 0.1);
  border: 2rpx solid #ff4d4f;
  border-radius: 12rpx;
  text-align: center;
  line-height: 1.8;
  animation: fadeIn 0.3s ease-out;
}

.error-tip-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.error-tip-link {
  font-size: 28rpx;
  color: #1890ff;
  line-height: 1.8;
  text-decoration: underline;
  text-underline-offset: 2rpx;

  &:active {
    opacity: 0.7;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Modal 内容样式
.modal-content {
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}
</style>
