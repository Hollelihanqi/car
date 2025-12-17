<!--
 * @Author: git.name
 * @Date: 2025-12-16
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-16 22:13:25
 * @Description: 开户申请步骤页面
-->
<template>
  <PageContainer>
    <view class="account-apply-page">
      <!-- 顶部 Header -->
      <view class="header">
        <view class="logo-section">
          <image src="/static/h5logo.png" class="hsbc-logo"></image>
        </view>
      </view>

      <!-- 标题 -->
      <view class="title-section">
        <text class="page-title">{{ pageData.title }}</text>
      </view>

      <!-- 步骤列表 -->
      <view class="steps-section">
        <view v-for="(step, index) in stepsList" :key="index" class="step-item">
          <view class="step-left">
            <view class="step-number">{{ index + 1 }}</view>
            <view v-if="index < stepsList.length - 1" class="step-line"></view>
          </view>
          <text class="step-text">{{ step }}</text>
        </view>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 姓名 -->
        <view class="form-item">
          <text class="form-label">{{ formData.name.label }}</text>
          <input
            v-model="formData.name.value"
            class="form-input"
            :placeholder="formData.name.placeholder"
            @blur="validateName"
          />
          <view v-if="formData.name.error" class="error-tip">
            <view class="error-icon-wrapper">
              <up-icon name="info-circle" size="20" color="#fff"></up-icon>
            </view>
            <text class="error-text">{{ formData.name.error }}</text>
          </view>
        </view>

        <!-- 国际电话区号和手机号码 -->
        <view class="form-row">
          <view class="form-item flex-1">
            <text class="form-label">{{ formData.phoneCode.label }}</text>
            <view class="form-select" @click="showPhoneCodePicker">
              <text class="select-text">{{ formData.phoneCode.value || formData.phoneCode.placeholder }}</text>
              <up-icon name="arrow-down" size="16" color="#999"></up-icon>
            </view>
          </view>
          <view class="form-item flex-2">
            <text class="form-label">{{ formData.phone.label }}</text>
            <input
              v-model="formData.phone.value"
              class="form-input"
              :placeholder="formData.phone.placeholder"
              type="number"
              @blur="validatePhone"
            />
            <view v-if="formData.phone.error" class="error-tip">
              <view class="error-icon-wrapper">
                <up-icon name="info-circle" size="20" color="#fff"></up-icon>
              </view>
              <text class="error-text">{{ formData.phone.error }}</text>
            </view>
          </view>
        </view>

        <!-- 短信验证码 -->
        <view class="form-item">
          <text class="form-label">{{ formData.smsCode.label }}</text>
          <view class="form-row-input">
            <input
              v-model="formData.smsCode.value"
              class="form-input flex-1"
              :placeholder="formData.smsCode.placeholder"
              type="number"
            />
            <view class="sms-button" @click="getSmsCode">
              <text class="sms-button-text">{{ smsButtonText }}</text>
            </view>
          </view>
        </view>

        <!-- 汇丰员工推荐码 -->
        <view class="form-item">
          <text class="form-label">{{ formData.referralCode.label }}</text>
          <input
            v-model="formData.referralCode.value"
            class="form-input"
            :placeholder="formData.referralCode.placeholder"
          />
        </view>
      </view>

      <!-- 服务说明 -->
      <view class="service-info">
        <text class="service-text">{{ pageData.serviceInfo }}</text>
      </view>

      <!-- 协议复选框 -->
      <view class="agreement-section">
        <view class="agreement-item" @click="toggleSelectAll">
          <u-checkbox v-model="agreements.selectAll" shape="circle"></u-checkbox>
          <text class="agreement-label">{{ agreements.selectAllText }}</text>
        </view>
        <view
          v-for="(agreement, index) in agreements.list"
          :key="index"
          class="agreement-item"
          @click="toggleAgreement(index)"
        >
          <u-checkbox v-model="agreement.checked" shape="circle"></u-checkbox>
          <text class="agreement-text">{{ agreement.text }}</text>
        </view>
      </view>

      <!-- 底部占位，防止内容被 footer 遮挡 -->
      <view class="footer-placeholder"></view>

      <!-- 提交按钮 Footer -->
      <view class="submit-footer">
        <view class="submit-button" :class="{ disabled: !canSubmit }" @click="handleSubmit">
          <text class="submit-button-text">{{ pageData.submitText }}</text>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PageContainer from '@/components/PageContainer.vue';

// 页面数据
const pageData = ref({
  title: '开户申请步骤',
  serviceInfo: '本申请服务由汇丰银行(中国)有限公司提供。',
  submitText: '同意授权并继续'
});

// 步骤列表
const stepsList = ref(['填写个人基本信息', '预约开户分支行', '补充开户信息']);

// 表单数据
const formData = ref({
  name: {
    label: '姓名',
    value: '',
    placeholder: '请输入',
    error: ''
  },
  phoneCode: {
    label: '国际电话区号',
    value: '+86',
    placeholder: '请选择'
  },
  phone: {
    label: '手机号码',
    value: '',
    placeholder: '请输入',
    error: ''
  },
  smsCode: {
    label: '短信验证码',
    value: '',
    placeholder: '请输入'
  },
  referralCode: {
    label: '汇丰员工推荐码(选填)',
    value: '',
    placeholder: '请输入'
  }
});

// 短信验证码按钮文字
const smsButtonText = ref('获取验证码');
const smsCountdown = ref(0);

// 协议数据
const agreements = ref({
  selectAll: false,
  selectAllText: '全选',
  list: [
    {
      checked: false,
      text: '本人已阅读并同意《汇丰银行(中国)有限公司个人信息及隐私保护政策》,并授权同意汇丰中国收集处理本人的个人信息,以完成开户预约及开户审查的目的。'
    },
    {
      checked: false,
      text: '本人同意贵行通过电话、短信、微信或其他方式联系本人,以便协助本人后续完成申请。'
    },
    {
      checked: false,
      text: '(选填)本人同意汇丰中国通过电话、短信、微信或其他方式向本人发送汇丰银行相关产品及服务的市场营销、用户体验和市场调查信息。'
    }
  ]
});

// 验证姓名
const validateName = () => {
  if (!formData.value.name.value) {
    formData.value.name.error = '请以正确的格式输入姓名。';
  } else {
    formData.value.name.error = '';
  }
};

// 验证手机号码
const validatePhone = () => {
  const phone = formData.value.phone.value;
  if (!phone) {
    formData.value.phone.error = '请输入有效的11位中国手机号码。';
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    formData.value.phone.error = '请输入有效的11位中国手机号码。';
  } else {
    formData.value.phone.error = '';
  }
};

// 获取短信验证码
const getSmsCode = () => {
  if (smsCountdown.value > 0) return;
  if (!formData.value.phone.value) {
    uni.showToast({ title: '请先输入手机号码', icon: 'none' });
    return;
  }
  // 开始倒计时
  smsCountdown.value = 60;
  smsButtonText.value = `${smsCountdown.value}秒`;
  const timer = setInterval(() => {
    smsCountdown.value--;
    if (smsCountdown.value > 0) {
      smsButtonText.value = `${smsCountdown.value}秒`;
    } else {
      smsButtonText.value = '获取验证码';
      clearInterval(timer);
    }
  }, 1000);
  uni.showToast({ title: '验证码已发送', icon: 'success' });
};

// 显示电话区号选择器
const showPhoneCodePicker = () => {
  // TODO: 实现电话区号选择器
  uni.showToast({ title: '选择电话区号', icon: 'none' });
};

// 全选/取消全选
const toggleSelectAll = () => {
  agreements.value.selectAll = !agreements.value.selectAll;
  agreements.value.list.forEach((item) => {
    item.checked = agreements.value.selectAll;
  });
};

// 切换单个协议
const toggleAgreement = (index: number) => {
  agreements.value.list[index].checked = !agreements.value.list[index].checked;
  // 检查是否全部选中
  agreements.value.selectAll = agreements.value.list.every((item) => item.checked);
};

// 是否可以提交
const canSubmit = computed(() => {
  return (
    formData.value.name.value &&
    formData.value.phone.value &&
    formData.value.smsCode.value &&
    agreements.value.list[0].checked &&
    agreements.value.list[1].checked
  );
});

// 提交表单
const handleSubmit = () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请完成必填项', icon: 'none' });
    return;
  }
  uni.showToast({ title: '提交成功', icon: 'success' });
  // TODO: 实现提交逻辑
};
</script>

<style lang="scss" scoped>
.account-apply-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 93px;
}

// 顶部 Header
.header {
  background: #fff;
  height: 50px;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.hsbc-logo {
  width: 80px;
  height: 24px;
}

.logo-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

// 标题区域
.title-section {
  padding: 32rpx;
  background: #fff;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

// 步骤列表
.steps-section {
  margin: 24rpx 32rpx;
  padding: 32rpx;
  background: transparent;
  border: 1rpx solid #e5e5e5;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
}

.step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: transparent;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 500;
  border: 1rpx solid #d0d0d0;
}

.step-line {
  width: 2rpx;
  height: 60rpx;
  background: #e5e5e5;
  margin-top: 8rpx;
}

.step-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  padding-top: 12rpx;
  flex: 1;
}

// 表单区域
.form-section {
  margin: 24rpx 32rpx;
  background: #fff;
  margin-top: 0;
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background: transparent;
  border: 1rpx solid #767676;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 24rpx;
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.form-select {
  height: 88rpx;
  padding: 0 24rpx;
  background: transparent;
  border: 1rpx solid #767676;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.select-text {
  font-size: 28rpx;
  color: #333;
}

.form-row-input {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.sms-button {
  padding: 0 32rpx;
  height: 88rpx;
  background: transparent;
  border: 1rpx solid #767676;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sms-button-text {
  font-size: 28rpx;
  color: #333;
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

// 服务说明
.service-info {
  padding: 0 32rpx;
  margin-bottom: 24rpx;
}

.service-text {
  font-size: 24rpx;
  color: #999;
  line-height: 1.6;
}

// 协议区域
.agreement-section {
  padding: 0 32rpx;
  margin-bottom: 40rpx;
}

.agreement-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.agreement-label {
  font-size: 28rpx;
  color: #333;
}

.agreement-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

// 底部占位
.footer-placeholder {
  height: 93px;
}

// 提交按钮 Footer
.submit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 93px;
  padding: 16px 32rpx;
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 100;
}

.submit-button {
  width: 100%;
  height: 45px;
  background: #db0011;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    background: #e5e5e5;
  }
}

.submit-button-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}
</style>
