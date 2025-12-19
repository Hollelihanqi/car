<!--
 * @Author: git.name
 * @Date: 2025-12-16
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-18 16:39:28
 * @Description: 开户申请步骤页面
-->
<template>
  <PageContainer>
    <view class="account-apply-page">
      <!-- 顶部 Header -->
      <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="header-content">
          <view class="logo-section">
            <image src="/static/h5logo.png" class="hsbc-logo"></image>
          </view>
        </view>
      </view>

      <!-- 标题 -->
      <view class="title-section">
        <text class="page-title">{{ pageData.title }}</text>
      </view>

      <view v-if="showTipCard" class="tip-card-wrap">
        <view class="tip-card" @click="handleLaunchMiniProgram">
          <view class="tip-content">
            <u-icon name="info-circle" size="18" color="#1890ff"></u-icon>
            <text class="tip-text">使用</text>
            <text class="tip-highlight">中移可信凭证</text>
            <text class="tip-link">自动填表</text>
            <u-icon name="arrow-rightward" size="20" color="#999" class="tip-arrow"></u-icon>
          </view>
        </view>
      </view>

      <!-- 步骤列表 -->
      <view class="steps-section">
        <view v-for="(step, index) in stepsList" :key="index" class="step-item">
          <view class="step-left">
            <view class="step-number">{{ index + 1 }}</view>
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

        <!-- 短信验证码 / 在网时长 -->
        <view class="form-item">
          <template v-if="credentialVerified">
            <text class="form-label">{{ formData.networkDuration.label }}</text>
            <input v-model="formData.networkDuration.value" class="form-input" :disabled="true" />
          </template>
          <template v-else>
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
          </template>
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
        <view class="agreement-item">
          <up-checkbox v-model:checked="selectAllChecked" usedAlone @change="onSelectAllChange"></up-checkbox>
          <text class="agreement-label">{{ agreements.selectAllText }}</text>
        </view>
        <up-checkbox-group v-model="agreementCheckedNames" @change="onAgreementGroupChange">
          <view v-for="(agreement, index) in agreements.list" :key="index" class="agreement-item">
            <up-checkbox :name="agreement.name"></up-checkbox>
            <text class="agreement-text">{{ agreement.text }}</text>
          </view>
        </up-checkbox-group>
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
  <up-modal
    :show="showApplyModal"
    title="提示"
    :showCancelButton="false"
    confirmText="知道了"
    confirmColor="#db0011"
    @confirm="showApplyModal = false"
  >
    <view class="modal-content">
      <text>已完成个人姓名、手机号码和在网时长的验证，接下来可继续后续的开户申请步骤。</text>
    </view>
  </up-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { onLoad, onShow } from '@dcloudio/uni-app';
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores/modules/credential';
import { useCredentialClipboard } from '@/hooks/useCredentialClipboard2';
const credentialStore = useCredentialStore();
const { isVerified: credentialVerified, credentialSubject } = storeToRefs(credentialStore);
// 初始化检测 Hook（只在一处初始化）
const { checkCredentialClipboard } = useCredentialClipboard({
  skipFirstCheck: false, // 不使用 skipFirstCheck，我们自己控制

  // 验证通过后的回调
  onMatch: (text) => {
    console.log('[Clipboard] 校验通过，开始导入');
    credentialStore.handleClipboardCredential(text);
  }
});
onShow(() => {
  // 检查剪贴板是否有凭证内容
  // 延迟检查，确保页面已经加载完成（避免在启动页时检测）
  // const delay = isFirstLaunch ? 1500 : 500; // 第一次启动延迟更长时间
  // if (isFirstLaunch) {
  //   isFirstLaunch = false; // 标记已不是第一次启动
  // }

  setTimeout(() => {
    // 检查页面栈，确保不在启动页
    try {
      const pages = getCurrentPages();
      if (pages.length === 0) {
        console.log('页面栈为空（启动页），跳过剪贴板检测');
        return;
      }

      const currentPage = pages[pages.length - 1];
      const currentRoute = currentPage.route || '';

      // 如果当前路由为空，说明还在启动页，不检测
      if (!currentRoute || currentRoute === '') {
        console.log('当前路由为空（启动页），跳过剪贴板检测');
        return;
      }

      // 只有在有有效路由时才检测剪贴板
      checkCredentialClipboard();
    } catch (error) {
      console.warn('检查页面状态失败，跳过剪贴板检测:', error);
    }
  }, 500);
});

// 状态栏高度（解决 custom 导航下与状态栏重叠）
const statusBarHeight = ref<number>(uni.getSystemInfoSync()?.statusBarHeight || 0);
const showApplyModal = ref(false);

// 入口模式：online(在线预约) / branch(在行直接办理)
const entry = ref<'online' | 'branch'>('online');
onLoad((options) => {
  const v = (options?.entry as string) || 'online';
  entry.value = v === 'branch' ? 'branch' : 'online';
});

// 页面数据
const pageData = ref({
  title: '开户申请步骤',
  serviceInfo: '本申请服务由汇丰银行(中国)有限公司提供。',
  submitText: '同意授权并继续'
});

// 步骤列表
const stepsList = computed(() => {
  return entry.value === 'branch'
    ? ['填写个人基本信息', '补充开户信息']
    : ['填写个人基本信息', '预约开户分支行', '补充开户信息'];
});

// tip-card 仅在在线预约且未验证时展示
const showTipCard = computed(() => !credentialVerified.value);

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
  networkDuration: {
    label: '在网时长>=1个月',
    value: '是',
    placeholder: ''
  },
  referralCode: {
    label: '汇丰员工推荐码(选填)',
    value: '',
    placeholder: '请输入'
  }
});

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
  formData.value.name.value = extractValue(subject, ['姓名', 'name', 'fullName']);
  formData.value.phone.value = extractValue(subject, ['手机号码', '手机号', 'phone', 'phoneNumber', 'mobile']);
  formData.value.networkDuration.value =
    extractValue(subject, ['在网时长>=1 个月', '在网时长>=1个月', '在网时长', '在網時長']) || '是';
};

watch(
  () => credentialVerified.value,
  (v) => {
    if (v) {
      fillFromCredential();
    }
  },
  { immediate: true }
);

// 短信验证码按钮文字
const smsButtonText = ref('获取验证码');
const smsCountdown = ref(0);

// 协议数据
const agreements = ref({
  selectAllText: '全选',
  list: [
    {
      name: 'policy',
      text: '本人已阅读并同意《汇丰银行(中国)有限公司个人信息及隐私保护政策》,并授权同意汇丰中国收集处理本人的个人信息,以完成开户预约及开户审查的目的。'
    },
    {
      name: 'contact',
      text: '本人同意贵行通过电话、短信、微信或其他方式联系本人,以便协助本人后续完成申请。'
    },
    {
      name: 'marketing',
      text: '(选填)本人同意汇丰中国通过电话、短信、微信或其他方式向本人发送汇丰银行相关产品及服务的市场营销、用户体验和市场调查信息。'
    }
  ]
});

// 复选框组选中值
const agreementCheckedNames = ref<string[]>([]);

// “全选”独立复选框（usedAlone）
const selectAllChecked = ref(false);

// 独立全选变化：同步到 group（用回调参数，避免 v-model 更新时序导致“反了”）
const onSelectAllChange = (val: any) => {
  const checked = typeof val === 'boolean' ? val : !!val?.detail?.value;
  selectAllChecked.value = checked;
  const itemNames = agreements.value.list.map((i) => i.name);
  agreementCheckedNames.value = checked ? [...itemNames] : [];
};

// 复选框组变化：反向同步全选状态
const onAgreementGroupChange = (payload: any) => {
  // 文档中 change 回调为 array（各端可能是 payload 或 payload.detail）
  // https://uview-plus.jiangruyi.com/components/checkbox.html
  const names: string[] = Array.isArray(payload) ? payload : Array.isArray(payload?.detail) ? payload.detail : [];
  agreementCheckedNames.value = names;

  const itemNames = agreements.value.list.map((i) => i.name);
  selectAllChecked.value = itemNames.length > 0 && itemNames.every((n) => names.includes(n));
};

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

// 拉起小程序申请凭证
const handleLaunchMiniProgram = () => {
  // 重置数据和状态
  setTimeout(() => {
    credentialStore.clearCredential();
  }, 1000);

  // 跳转到加载页面
  uni.redirectTo({
    url: '/pages/home/CredentialLoading'
  });
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

// 是否可以提交
const canSubmit = computed(() => {
  const baseOk =
    !!formData.value.name.value &&
    !!formData.value.phone.value &&
    agreementCheckedNames.value.includes('policy') &&
    agreementCheckedNames.value.includes('contact');

  if (credentialVerified.value) {
    return baseOk && !!formData.value.networkDuration.value;
  }

  return baseOk && !!formData.value.smsCode.value;
});

// 提交表单
const handleSubmit = () => {
  showApplyModal.value = true;
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
  box-sizing: border-box;
}

.header-content {
  height: 50px;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
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

// 顶部提示卡片
.tip-card-wrap {
  padding: 0 32rpx 24rpx;
}

.tip-card {
  padding: 32rpx;
  border-radius: 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
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

// 步骤列表
.steps-section {
  margin: 24rpx 32rpx;
  padding: 32rpx;
  background: transparent;
  border: 1rpx solid #e5e5e5;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-left {
  position: relative;
  width: 48rpx;
  flex-shrink: 0;
}

.step-number {
  position: relative;
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

.step-number::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 2rpx;
  height: 40rpx;
  background: #e5e5e5;
}

.step-item:last-child .step-number::after {
  display: none;
}

.step-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
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
  padding: 0 32rpx;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  box-sizing: border-box;
  z-index: 100;
  display: flex;
  align-items: center;
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
