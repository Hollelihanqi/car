<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 15:00:42
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view v-if="!areaCode">
      <view class="page-title">验证您的手机号码</view>
      <view class="mx-[32rpx] mt-[50rpx] p-[20rpx] border border-solid border-[#bbb] flex justify-between items-center">
        <view class="text-[24rpx]">中国大陆用户请上传手机号实名身份凭证</view>
        <view class="submit-button rounded w-[150rpx]! h-[60rpx]!" @click="handleLaunchMiniProgram">
          <text class="submit-button-text text-[26rpx]!">点击获取</text>
        </view>
        <!-- <view>点击获取</view> -->
      </view>
      <view class="px-[32rpx] mt-[50rpx] flex flex-col gap-[80rpx]">
        <view>
          <view class="text-[#666]">手机号码</view>
          <view class="flex border-0 border-b border-solid border-[#767676]">
            <view
              class="flex items-center gap-[10rpx] pl-[24rpx]"
              @click="
                () => {
                  areaCode = true;
                }
              "
            >
              <view>+86</view>
              <view><up-icon name="arrow-down" bold /></view>
            </view>
            <input v-model="inputValue.phone" readonly disabled class="form-input border-0!" />
          </view>
        </view>
        <view>
          <view class="text-[#666]">姓名</view>
          <input v-model="inputValue.name" readonly disabled class="form-input" />
        </view>
        <view>
          <view class="text-[#666]">在网时长大于1个月（含）</view>
          <input v-model="inputValue.networkDuration" readonly disabled class="form-input" />
        </view>
      </view>

      <!-- 按钮 -->
      <view class="flex submit-footer">
        <view class="flex w-2/5 items-center gap-[20rpx]" @click="onBackStep">
          <view><up-icon name="arrow-left" size="24" bold color="#db0011" /></view>
          <view>返回</view>
        </view>
        <view class="submit-button" :class="isVerified ? '' : 'bg-[#7e7e7e]!'" @click="toStepNext">
          <text class="submit-button-text">继续</text>
        </view>
      </view>
    </view>
    <!-- 选择国家或地区 -->
    <AreaCode
      v-else
      @change-area-code="
        () => {
          areaCode = false;
        }
      "
    ></AreaCode>
    <VerifyMobile ref="verifyMobileModal" @fill-from-credential="fillFromCredential"></VerifyMobile>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import AreaCode from './areaCodeComponent.vue';
import VerifyMobile from './verifyModalComponent.vue';
import { ref } from 'vue';
import { useCredentialStore } from '@/stores';
const credentialStore = useCredentialStore();
const { credentialSubject } = storeToRefs(credentialStore);
const inputValue = reactive({
  name: '',
  phone: '',
  networkDuration: ''
});
const isVerified = ref(false);
const areaCode = ref(false);
const verifyMobileModal = ref<{ showModal: () => void } | null>(null);
const showVerifyMobileModal = () => {
  verifyMobileModal.value?.showModal();
};
/** 拉起小程序 */
const handleLaunchMiniProgram = () => {
  showVerifyMobileModal();
  credentialStore.launchMiniProgram();
};

const extractValue = (source: Record<string, any>, keys: string[]): string => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
  }
  return '';
};

const fillFromCredential = () => {
  const subject = (credentialSubject.value || {}) as Record<string, any>;
  inputValue.name = extractValue(subject, ['姓名', 'name', 'fullName']);
  inputValue.phone = extractValue(subject, ['手机号码', '手机号', 'phone', 'phoneNumber', 'mobile']);
  inputValue.networkDuration =
    extractValue(subject, ['在网时长>=1 个月', '在网时长>=1个月', '在网时长', '在網時長']) || '是';
  isVerified.value = true;
};

const toStepNext = () => {
  if (isVerified.value) {
    uni.navigateTo({
      url: '/pages/register/end'
    });
  }
};
const onBackStep = () => {
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
}

.submit-button-text {
  font-size: 30rpx;
  color: #fff;
}
.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: transparent;
  border-bottom: 1rpx solid #767676;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}
.error-tip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
  padding: 12rpx 16rpx;
  background: #fff5f5;
  border: 1rpx solid #ff6b6b;
  border-left: 4rpx solid #ff6b6b;
}

.error-icon-wrapper {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #ff9800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-text {
  font-size: 24rpx;
  color: #ff6b6b;
  flex: 1;
}
</style>
