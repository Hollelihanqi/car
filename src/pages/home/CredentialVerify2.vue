<template>
  <PageContainer>
    <view class="flex flex-col bg-white h-screen px-4 pt-6 pb-6 overflow-hidden">
      <!-- 标题部分 -->
      <view class="verify-header mb-6">
        <view class="header-icon-wrapper">
          <view class="header-icon">
            <view class="shield-icon"></view>
          </view>
        </view>
        <text class="header-title">{{ allVerified ? '验证已完成' : '验证中' }}</text>
        <text v-if="!allVerified" class="header-subtitle">正在验证凭证信息...</text>
      </view>

      <!-- 验证条目列表 -->
      <view class="bg-white rounded-8 shadow-md p-6 mb-4 shrink-0">
        <view class="flex flex-col">
          <view
            v-for="(item, index) in verifyItems"
            :key="index"
            class="flex items-center justify-between py-3 verify-item"
          >
            <view class="text-4 text-gray-900 flex-1 font-normal">{{ item.label }}</view>
            <view class="flex items-center justify-center shrink-0 ml-3 w-10 h-10">
              <!-- 成功状态：绿色圆圈带白色勾 -->
              <view v-if="item.status === 'success'" class="flex items-center justify-center">
                <view class="success-circle">
                  <view class="success-checkmark"></view>
                </view>
              </view>
              <!-- 加载中状态：灰色圆形箭头（旋转） -->
              <view v-else-if="item.status === 'loading'" class="flex items-center justify-center">
                <view class="loading-circle">
                  <view class="loading-arrow"></view>
                </view>
              </view>
              <!-- 待处理状态：刷新图标（灰色圆形箭头） -->
              <view v-else class="flex items-center justify-center">
                <view class="refresh-icon">
                  <view class="refresh-circle"></view>
                  <view class="refresh-arrow"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 验证成功标识 -->
      <view v-if="allVerified" class="verify-success-card shrink-0">
        <view class="success-icon-wrapper">
          <view class="success-icon-bg">
            <view class="success-check-large"></view>
          </view>
        </view>
        <text class="success-title">驗證通過</text>
        <view class="success-info">
          <view class="info-row">
            <text class="info-label">驗證流水號</text>
            <text class="info-value">{{ verifySerialNumber }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">驗證時間</text>
            <text class="info-value">{{ verifyTime }}</text>
          </view>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores';
import { verifyVC } from '@/api/credential';

interface VerifyItem {
  label: string;
  status: 'pending' | 'loading' | 'success';
}

const credentialStore = useCredentialStore();

const verifyItems = ref<VerifyItem[]>([
  { label: '验证签发者身份', status: 'pending' }, //RegisteredIssuer
  { label: '验证所有者身份', status: 'pending' }, // VCIdNotFound
  { label: '验证签名', status: 'pending' }, // ValidSign
  { label: '验证有效期', status: 'pending' }, //  VCStatusNormal
  { label: '验证吊销状态', status: 'pending' } // VCStatusNormal
]);

const allVerified = ref(false);
const verifySerialNumber = ref('');
const verifyTime = ref('');

/** 生成验证流水号 */
const generateSerialNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `VF${timestamp}${random}`;
};

/** 获取当前时间 ISO 格式 */
const getCurrentTime = () => {
  return new Date().toISOString();
};

/** 调用后端验证接口 */
const callVerifyAPI = async () => {
  try {
    const credential = credentialStore.credentialInfo;
    const hash = credentialStore.credentialDigest;

    if (!credential) {
      throw new Error('凭证信息不存在');
    }

    // 从凭证中提取必要参数
    const issuerDid = credential.issuer || '';
    const vcId = credential.id || '';
    const proofValue = credential.proof?.proofValue || '';
    const verificationMethod = credential.proof?.verificationMethod || '';

    // 从 verificationMethod 中提取 keyIndex
    // 例如: "did:gxdid:ecdbeb0caa284b4b88a8632dc64ab1fe#keys-1" => 1
    let keyIndex: number | undefined = undefined; // 默认值
    if (verificationMethod) {
      const match = verificationMethod.match(/#keys-(\d+)/);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed)) {
          keyIndex = parsed;
        }
      }
    }

    // 构建请求参数
    const params = {
      issuerDid,
      proofValue,
      digest: hash,
      keyIndex,
      vcHash: credentialStore.vcHash,
      vcId
    };

    console.log('result----------1', params);

    // 调用验证接口
    const result = await verifyVC(params);

    console.log('result----------2', result);

    // 使用后端返回的流水号和时间
    verifySerialNumber.value = result.serialNumber;
    verifyTime.value = result.verifyTime;

    return '';
  } catch (error) {
    console.error('VC 验证失败:', error);
    uni.showToast({
      title: '验证失败，请重试',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
};

/** 模拟验证过程 */
const startVerification = async () => {
  const verificationSuccess = true;

  for (let i = 0; i < verifyItems.value.length; i++) {
    // 设置当前项为加载中
    verifyItems.value[i].status = 'loading';

    // 模拟验证延迟（800ms - 1500ms随机）
    await new Promise((resolve) => {
      setTimeout(resolve, 800 + Math.random() * 700);
    });

    // 设置为成功
    verifyItems.value[i].status = 'success';
  }

  // 调用后端验证接口
  const apiSuccess = await callVerifyAPI();
  console.log('apiSuccess', apiSuccess);
  // if (!apiSuccess) {
  //   verificationSuccess = false;
  // }

  // 模拟验证成功或失败（可以根据实际情况修改）
  // verificationSuccess = Math.random() > 0.3; // 70% 成功率用于测试

  // 设置验证状态到 store
  credentialStore.setVerificationStatus(verificationSuccess);

  if (verificationSuccess) {
    // 验证成功
    allVerified.value = true;
    verifySerialNumber.value = generateSerialNumber();
    verifyTime.value = getCurrentTime();

    // 延迟跳转到信息填写页面
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/home/CredentialInfo'
      });
    }, 2000);
  } else {
    // 验证失败
    allVerified.value = false;

    // 重置所有验证项状态
    verifyItems.value.forEach((item) => {
      item.status = 'pending';
    });

    // 显示失败提示
    uni.showToast({
      title: '凭证验证失败',
      icon: 'none',
      duration: 2000
    });

    // 延迟跳转到信息填写页面（手动填写）
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/home/CredentialInfo'
      });
    }, 2000);
  }
};

onMounted(() => {
  startVerification();
});
</script>

<style scoped lang="scss">
// 标题区域样式
.verify-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.header-icon-wrapper {
  margin-bottom: 16rpx;
}

.header-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.shield-icon {
  width: 36rpx;
  height: 44rpx;
  border: 4rpx solid #ffffff;
  border-radius: 4rpx 4rpx 8rpx 8rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12rpx;
    height: 8rpx;
    border-left: 3rpx solid #ffffff;
    border-bottom: 3rpx solid #ffffff;
    transform: translate(-50%, -60%) rotate(-45deg);
  }
}

.header-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: 26rpx;
  color: #999;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
  }
}

// 验证条目边框样式
.verify-item {
  border-bottom: 1rpx solid #f0f0f0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

// 成功状态：绿色圆圈带白色勾
.success-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.success-checkmark {
  width: 20rpx;
  height: 12rpx;
  border-left: 3rpx solid #ffffff;
  border-bottom: 3rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

// 加载中状态：灰色圆形箭头（旋转）
.loading-circle {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}

.loading-arrow {
  position: absolute;
  top: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6rpx solid transparent;
  border-right: 6rpx solid transparent;
  border-top: 8rpx solid #999999;
}

// 待处理状态：刷新图标（灰色圆形箭头）
.refresh-icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-circle {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.refresh-arrow {
  position: absolute;
  top: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5rpx solid transparent;
  border-right: 5rpx solid transparent;
  border-top: 8rpx solid #999999;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 验证成功卡片
.verify-success-card {
  background: linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%);
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(82, 196, 26, 0.15);
  border: 2rpx solid #b7eb8f;
  margin-top: 24rpx;
}

.success-icon-wrapper {
  margin-bottom: 20rpx;
}

.success-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(82, 196, 26, 0.3);
  animation: successPop 0.5s ease-out;
}

.success-check-large {
  width: 40rpx;
  height: 20rpx;
  border-left: 5rpx solid #ffffff;
  border-bottom: 5rpx solid #ffffff;
  transform: rotate(-45deg);
  margin-top: -6rpx;
}

.success-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #52c41a;
  margin-bottom: 24rpx;
}

.success-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12rpx;
}

.info-label {
  font-size: 24rpx;
  color: #52c41a;
  opacity: 0.7;
  flex-shrink: 0;
}

.info-value {
  font-size: 24rpx;
  color: #52c41a;
  font-weight: 500;
  word-break: break-all;
  text-align: left;
  flex: 1;
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
