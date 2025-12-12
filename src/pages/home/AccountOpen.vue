<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-10
 * @Description: 开立账户页面
-->
<template>
  <PageContainer>
    <view>
      <!-- 顶部导航栏 -->
      <view class="header">
        <u-icon name="arrow-left" size="24" color="#333" @click="onBack"></u-icon>
        <text class="header-title">我要开户</text>
      </view>

      <!-- 提示文字 -->
      <view class="tips-section">
        <text class="tips-text">请选择您对户的账户种类</text>
      </view>

      <!-- 账户类型列表 -->
      <view class="account-types">
        <!-- 汇丰个人银行账户 -->
        <view class="account-card">
          <view class="card-header">
            <text class="card-title">汇丰个人银行账户</text>
            <view class="credential-badge" @click="onCredentialOpen">
              <u-icon name="lock" size="18" color="#db0011"></u-icon>
              <text class="badge-text">使用凭证开户</text>
            </view>
          </view>
          <text class="card-desc">
            汇丰可提供您线上人钱包、卓越理财、运筹理财等不同层次，包括银钱智能服务、家庭金融智慧服务、支付交易和投资人的一路跨行。
          </text>
          <view class="feature-icons">
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="account" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">线上随时自办开户</text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="file-text" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">仅须经场换银行业务</text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="shopping-cart" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">财富管理试心维护</text>
            </view>
          </view>
        </view>

        <!-- 汇丰人民币单币账户 -->
        <view class="account-card">
          <view class="card-header">
            <text class="card-title">汇丰人民币II账户</text>
            <view class="credential-badge" @click="onCredentialActivate">
              <u-icon name="lock" size="18" color="#db0011"></u-icon>
              <text class="badge-text">使用凭证开通</text>
            </view>
          </view>
          <text class="card-desc">
            汇丰人民币单币账户可凭定本人有效的美国银行账户或汇丰中国信用卡账户，无需本地，零存理财、安全快捷，在线秘化开户门槛，即可办理存款及投款定汇丰中国信用卡进往迹。
          </text>
          <view class="feature-icons">
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="play-circle" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">在线-键统开户</text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="shop" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">物资产品资金资财</text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="edit-pen" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">闲慎理资通周资通</text>
            </view>
          </view>
        </view>

        <!-- 汇丰信用卡 -->
        <view class="account-card">
          <view class="card-header">
            <text class="card-title">汇丰信用卡</text>
            <view class="credential-badge" @click="onCredentialApply">
              <u-icon name="lock" size="18" color="#db0011"></u-icon>
              <text class="badge-text">使用凭证申请</text>
            </view>
          </view>
          <text class="card-desc">在线新进汇丰中国信用卡申请单您</text>
          <text class="card-subdesc">
            成功申请汇丰中国信用卡，卡片并获授信额度后，在授信额度内专款抵债，尊享人气业美卡折扣等利差专项。
          </text>
          <view class="feature-icons">
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="order" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">五秒钟完统信申请</text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="gift" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">尊享开卡考积利</text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="map" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">信积租纺论兑礼遇</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import { useCredentialStore } from '@/stores/modules/credential';

const credentialStore = useCredentialStore();

const onBack = () => {
  uni.navigateBack();
};

const onCredentialOpen = () => {
  credentialStore.clearCredential();
  credentialStore.setVerificationStatus(true);
  uni.navigateTo({ url: '/pages/home/CredentialInfo' });
};

const onCredentialActivate = () => {
  credentialStore.clearCredential();
  credentialStore.setVerificationStatus(true);
  uni.navigateTo({ url: '/pages/home/CredentialInfo' });
};

const onCredentialApply = () => {
  credentialStore.clearCredential();
  credentialStore.setVerificationStatus(true);
  uni.navigateTo({ url: '/pages/home/CredentialInfo' });
};
</script>

<style lang="scss" scoped>
.account-open-page {
  min-height: 100vh;
  background: #f5f5f5;
}

// 顶部导航栏
.header {
  background: #fff;
  padding: 24rpx 32rpx;
  padding-top: calc(24rpx + var(--status-bar-height));
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.header-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

// 提示区域
.tips-section {
  padding: 32rpx;
  text-align: center;
}

.tips-text {
  font-size: 28rpx;
  color: #666;
}

// 账户类型列表
.account-types {
  padding: 0 32rpx 32rpx;
}

.account-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.credential-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #db0011;
  border: 2rpx solid #db0011;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  background: #fff;

  &.primary {
    background: #db0011;
    border-color: #db0011;

    .badge-text {
      color: #fff;
    }
  }
}

.badge-text {
  color: #db0011;
}

.card-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 8rpx;
}

.card-subdesc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24rpx;
}

.feature-icons {
  display: flex;
  justify-content: space-around;
  margin-top: 32rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  flex: 1;
}

.feature-icon {
  width: 88rpx;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-label {
  font-size: 20rpx;
  color: #666;
  text-align: center;
  line-height: 1.4;
}
</style>
