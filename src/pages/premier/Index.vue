<!--
 * @Author: git.name
 * @Date: 2025-12-16
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-17 14:39:35
 * @Description: 汇丰卓越理财页面
-->
<template>
  <PageContainer>
    <view class="premier-wealth-page">
      <!-- 顶部 Header -->
      <view class="header sticky z-10" :style="{ top: `calc(var(--status-bar-height))` }">
        <view class="logo-section">
          <image src="/static/h5logo.png" class="hsbc-logo"></image>
        </view>
      </view>

      <!-- Banner Carousel -->
      <view class="banner-section">
        <swiper
          class="banner-swiper"
          :indicator-dots="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#fff"
          circular
        >
          <swiper-item v-for="(banner, index) in bannerList" :key="index" class="banner-item">
            <image :src="banner.image" class="banner-image" mode="aspectFill"></image>
            <view class="banner-overlay">
              <view class="overlay-content">
                <text class="overlay-title">{{ banner.title }}</text>
                <view class="overlay-points">
                  <view class="points-column">
                    <text v-for="(point, pIndex) in banner.leftPoints" :key="pIndex" class="point-item">
                      {{ point }}
                    </text>
                  </view>
                  <view class="points-column">
                    <text v-for="(point, pIndex) in banner.rightPoints" :key="pIndex" class="point-item">
                      {{ point }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="banner-helper-icon">
          <text class="helper-text">中</text>
          <text class="helper-text">A</text>
        </view>
      </view>

      <!-- Action Buttons -->
      <view class="action-buttons">
        <view class="action-btn" @click="handleOnlineAppointment">
          <view class="btn-icon">
            <u-icon name="phone" size="40" color="#db0011"></u-icon>
          </view>
          <text class="btn-text">在线提前预约</text>
        </view>
        <view class="action-btn" @click="handleInBranch">
          <view class="btn-icon">
            <u-icon name="home" size="40" color="#db0011"></u-icon>
          </view>
          <text class="btn-text">在行直接办理</text>
        </view>
      </view>

      <!-- Main Heading -->
      <view class="main-heading">
        <text class="heading-text">{{ pageData.mainHeading }}</text>
      </view>

      <!-- Service Cards -->
      <view class="service-cards">
        <view v-for="(service, index) in serviceList" :key="index" class="service-card">
          <view class="service-title-wrapper">
            <view class="title-indicator"></view>
            <text class="service-title">{{ service.title }}</text>
          </view>
          <text class="service-desc">{{ service.description }}</text>
        </view>
      </view>

      <!-- Bottom Section -->
      <view class="bottom-section">
        <text class="eligibility-text">{{ pageData.eligibilityText }}</text>
        <view class="contact-info">
          <text class="contact-text">{{ pageData.contactText }}</text>
          <text class="contact-detail">{{ pageData.contactDetail }}</text>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '@/components/PageContainer.vue';

// 处理在线提前预约
const handleOnlineAppointment = () => {
  uni.navigateTo({ url: '/pages/account-apply/Index?entry=online' });
};

// 处理在行直接办理
const handleInBranch = () => {
  // uni.navigateTo({ url: '/pages/account-apply/Index?entry=branch' });
  uni.showToast({ title: '请点“在线提前预约”按钮', icon: 'none' });
};

// 页面数据
const pageData = ref({
  mainHeading: '多维、个性化金融解决方案为您开启卓越之旅',
  eligibilityText:
    '成为汇丰中国卓越理财客户，需满足以下条件之一：在汇丰中国同一客户号码下的所有账户月内日均总余额不低于等值人民币50万元或等值外币。',
  contactText: '如需了解更多信息，请访问汇丰中国官网或致电400-820-3090',
  contactDetail: '(8:30-17:30,周一至周五,节假日除外)'
});

// 轮播图数据
const bannerList = ref([
  {
    image: '/static/ban11.png',
    title: '汇丰环球金融',
    leftPoints: ['·一地卓越全球卓越', '·多元的环球投资机会'],
    rightPoints: ['·多样化外币解决方案', '·环球账户查阅与转账']
  },
  {
    image: '/static/ban12.png',
    title: '汇丰环球金融',
    leftPoints: ['·一地卓越全球卓越', '·多元的环球投资机会'],
    rightPoints: ['·多样化外币解决方案', '·环球账户查阅与转账']
  },
  {
    image: '/static/ban13.png',
    title: '汇丰环球金融',
    leftPoints: ['·一地卓越全球卓越', '·多元的环球投资机会'],
    rightPoints: ['·多样化外币解决方案', '·环球账户查阅与转账']
  }
]);

// 服务列表数据
const serviceList = ref([
  {
    title: '环球银行服务',
    description: '为您提供留学金融服务(包括海外开户预约)、环球转账与查阅、环球紧急支援等金融相关服务和功能支持。'
  },
  {
    title: '财富管理与规划',
    description: '为您提供一系列丰富的财富管理产品(包括投资理财产品和代销保险业务)和量身定制财富管理解决方案。'
  },
  {
    title: '家庭金融服务',
    description: '父母与子女或者夫妻加入家庭金融服务,家庭成员交易详情和资产组合汇于一处,一目了然方便管理(获得授权后)。'
  },
  {
    title: '尊崇专属礼遇',
    description:
      '全方位电子渠道轻松办理银行业务,并配有专属的一对一客户经理或卓越理财客户主任团队,满足您和家人的各项需求。'
  }
]);
</script>

<style lang="scss" scoped>
.premier-wealth-page {
  min-height: 100vh;
  background: #f5f5f5;
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
  top: calc(var(--status-bar-height));
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100%;
}

.hsbc-logo {
  width: 100%;
  height: 24px;
}

// Banner Carousel
.banner-section {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
}

.banner-swiper {
  width: 100%;
  height: 100vw;
}

.banner-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.overlay-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 24rpx;
  backdrop-filter: blur(10rpx);
}

.overlay-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.overlay-points {
  display: flex;
  gap: 24rpx;
}

.points-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.point-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}

.banner-helper-icon {
  position: absolute;
  bottom: 24rpx;
  right: 24rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 192, 203, 0.8);
  border: 2rpx solid #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.helper-text {
  font-size: 20rpx;
  color: #333;
  line-height: 1;
}

// Action Buttons
.action-buttons {
  display: flex;
  gap: 24rpx;
  padding: 32rpx;
  background: #fff;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 32rpx 24rpx;
  background: #fff;
  border: 2rpx solid #e5e5e5;
  border-radius: 16rpx;
}

.btn-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 16rpx;
}

.btn-text {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}

// Main Heading
.main-heading {
  background: #e8e8e8;
  padding: 32rpx;
  margin-top: 24rpx;
}

.heading-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.6;
}

// Service Cards
.service-cards {
  padding: 32rpx;
  background: #fff;
}

.service-card {
  margin-bottom: 32rpx;
  padding-bottom: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.service-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.title-indicator {
  width: 6rpx;
  height: 32rpx;
  background: #db0011;
  border-radius: 3rpx;
  flex-shrink: 0;
}

.service-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.service-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

// Bottom Section
.bottom-section {
  padding: 32rpx;
  background: #fff;
  margin-top: 24rpx;
}

.eligibility-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24rpx;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.contact-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.contact-detail {
  font-size: 24rpx;
  color: #999;
  line-height: 1.6;
}
</style>
