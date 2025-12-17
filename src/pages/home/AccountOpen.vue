<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-16 20:23:36
 * @Description: 开立账户页面
-->
<template>
  <PageContainer>
    <view>
      <!-- 顶部导航栏 -->
      <view class="header">
        <u-icon name="arrow-left" size="24" color="#333" @click="onBack"></u-icon>
        <text class="header-title">{{ pageData.headerTitle }}</text>
      </view>

      <!-- 提示文字 -->
      <view class="tips-section">
        <text class="tips-text">{{ pageData.tipsText }}</text>
      </view>

      <!-- 账户类型列表 -->
      <view class="account-types">
        <view v-for="(account, index) in accountList" :key="index" class="account-card">
          <view class="card-header">
            <view class="card-title-wrapper">
              <view class="title-indicator"></view>
              <text class="card-title">{{ account.title }}</text>
            </view>
            <view class="credential-badge" @click="account.onClick">
              <u-icon name="lock" size="18" color="#db0011"></u-icon>
              <text class="badge-text">{{ account.badgeText }}</text>
            </view>
          </view>
          <text class="card-desc">{{ account.description }}</text>
          <text v-if="account.subDescription" class="card-subdesc">{{ account.subDescription }}</text>
          <view class="feature-icons">
            <view v-for="(feature, featureIndex) in account.features" :key="featureIndex" class="feature-item">
              <view class="feature-icon">
                <u-icon :name="feature.icon" size="28" color="#db0011"></u-icon>
              </view>
              <text class="feature-label">{{ feature.label }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '@/components/PageContainer.vue';

// 页面数据
const pageData = ref({
  headerTitle: '我要开户',
  tipsText: '请选择您开户的账户种类'
});

// 处理函数
const onBack = () => {
  uni.navigateBack();
};

const onCredentialOpen = () => {
  uni.navigateTo({ url: '/pages/premier/Index' });
};

const onCredentialActivate = () => {
  uni.navigateTo({ url: '/pages/premier/Index' });
};

const onCredentialApply = () => {
  uni.navigateTo({ url: '/pages/premier/Index' });
};

// 账户列表数据
const accountList = ref([
  {
    title: '汇丰个人银行账户',
    badgeText: '智能开户',
    description:
      '汇丰可提供您线上人钱包、卓越理财、运筹理财等不同层次，包括银钱智能服务、家庭金融智慧服务、支付交易和投资人的一路跨行。',
    subDescription: '',
    features: [
      {
        icon: 'account',
        label: '线上预约柜台办理'
      },
      {
        icon: 'coupon-fill',
        label: '体验环球银行业务'
      },
      {
        icon: 'shopping-cart',
        label: '财富管理精心推荐'
      }
    ],
    onClick: onCredentialOpen
  },
  {
    title: '汇丰人民币II账户',
    badgeText: '申请开通',
    description:
      '汇丰人民币单币账户可凭定本人有效的美国银行账户或汇丰中国信用卡账户，无需本地，零存理财、安全快捷，在线秘化开户门槛，即可办理存款及投款定汇丰中国信用卡进往迹。',
    subDescription: '',
    features: [
      {
        icon: 'play-circle',
        label: '在线-键统开户'
      },
      {
        icon: 'rmb-circle',
        label: '购买产品即享积分'
      },
      {
        icon: 'edit-pen',
        label: '期限灵活机制简单'
      }
    ],
    onClick: onCredentialActivate
  },
  {
    title: '汇丰信用卡',
    badgeText: '选卡申请',
    description: '在线新进汇丰中国信用卡申请单您',
    subDescription: '成功申请汇丰中国信用卡，卡片并获授信额度后，在授信额度内专款抵债，尊享人气业美卡折扣等利差专项。',
    features: [
      {
        icon: 'order',
        label: '五秒轻松完成申请'
      },
      {
        icon: 'gift',
        label: '尊享丰富开卡好礼'
      },
      {
        icon: 'map',
        label: '玩转缤纷优惠礼遇'
      }
    ],
    onClick: onCredentialApply
  }
]);
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

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.title-indicator {
  width: 6rpx;
  height: 32rpx;
  background: #db0011;
  border-radius: 3rpx;
  flex-shrink: 0;
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
  cursor: pointer;
  user-select: none;

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
