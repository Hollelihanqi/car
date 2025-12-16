<!--
 * @Author: git.name
 * @Date: 2025-12-03 16:57:37
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-16 16:56:27
 * @Description: 汇丰银行首页
-->
<template>
  <view class="hsbc-home-page">
    <!-- 顶部导航栏 -->
    <view class="top-bar">
      <view class="search-bar">
        <u-icon name="search" size="18" color="#999"></u-icon>
      </view>
      <view class="top-icons">
        <u-icon name="phone" size="22" color="#fff"></u-icon>
        <u-icon name="bell" size="22" color="#fff" class="ml-4"></u-icon>
      </view>
    </view>

    <!-- 快捷功能区 -->
    <view class="quick-actions">
      <view v-for="(item, index) in quickActions" :key="index" class="action-item" @click="item.onClick">
        <view class="action-icon">
          <u-icon :name="item.icon" size="28" color="#db0011"></u-icon>
        </view>
        <text class="action-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 公告区 -->
    <view class="notice-section">
      <view class="notice-badge">公告</view>
      <text class="notice-text">
        汇丰中国承诺在香港和中国内地个人银行业务管理服务 - 卓越理财服务月费限时免除活动期的后续安排
      </text>
    </view>

    <!-- Banner 轮播 -->
    <view class="banner-section">
      <swiper class="banner-swiper" :indicator-dots="false" circular autoplay>
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <view class="banner-item">
            <image :src="banner.image" mode="aspectFill" class="banner-img"></image>
            <view class="banner-content">
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-subtitle">{{ banner.subtitle }}</text>
              <view class="banner-button">{{ banner.buttonText }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <view class="banner-dots">
        <view v-for="(banner, index) in banners" :key="index" class="dot" :class="{ active: index === 0 }"></view>
      </view>
    </view>

    <!-- 产品推荐区 -->
    <view class="product-section">
      <view class="product-tabs">
        <view
          v-for="(tab, index) in productTabs"
          :key="index"
          class="tab-item"
          :class="{ active: tab.active }"
          @click="onTabClick(index)"
        >
          {{ tab.label }}
        </view>
      </view>

      <view class="product-list">
        <view v-for="(product, index) in productList" :key="index" class="product-item">
          <view class="product-header">
            <text class="product-name">{{ product.name }}</text>
            <text v-if="product.isNew" class="product-tag new">新产品</text>
          </view>
          <view v-if="product.rate" class="product-info">
            <view class="product-rate">
              <text class="rate-value">{{ product.rate }}</text>
              <text class="rate-label">{{ product.rateLabel }}</text>
            </view>
            <view class="product-status">
              <text class="status-label">{{ product.status }}</text>
              <text class="status-detail">{{ product.detail }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view
        v-for="(item, index) in navItems"
        :key="index"
        class="nav-item"
        :class="{ active: item.active }"
        @click="item.onClick"
      >
        <u-icon :name="item.icon" size="22" :color="item.active ? '#db0011' : '#666'"></u-icon>
        <text class="nav-label" :class="{ active: item.active }">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 剪贴板检测已统一在 App.vue 中处理，此处不再需要

// 快捷功能区数据
const quickActions = [
  {
    icon: 'gift',
    label: '转账活动',
    onClick: () => onTransfer()
  },
  {
    icon: 'account',
    label: '开立账户',
    onClick: () => onOpenAccount()
  },
  {
    icon: 'map',
    label: '大湾区理财通',
    onClick: () => uni.showToast({ title: '大湾区理财通', icon: 'none' })
  },
  {
    icon: 'chat',
    label: '联系我们',
    onClick: () => onContact()
  }
];

// 底部导航数据
const navItems = [
  {
    icon: 'home',
    label: '首页',
    active: true,
    onClick: () => uni.showToast({ title: '首页', icon: 'none' })
  },
  {
    icon: 'bag',
    label: '财富管理',
    active: false,
    onClick: () => uni.showToast({ title: '财富管理', icon: 'none' })
  },
  {
    icon: 'account',
    label: '我的',
    active: false,
    onClick: () => uni.showToast({ title: '我的', icon: 'none' })
  }
];

// Banner轮播数据
const banners = [
  {
    image: '/static/ban1.png',
    title: '借基入市，多元化投资',
    subtitle: '内地证券投资基金（代销）接受专区',
    buttonText: '即刻联系者'
  },
  {
    image: '/static/ban2.png',
    title: '智能理财，轻松管理',
    subtitle: '全新智能投资顾问服务',
    buttonText: '立即体验'
  },
  {
    image: '/static/ban3.png',
    title: '全球资产配置',
    subtitle: '专业跨境理财解决方案',
    buttonText: '了解更多'
  }
];

// 产品标签数据
const productTabs = ref([
  { label: '代客境外理财-海外基金（自有）', active: true },
  { label: '结构性存款（自有）', active: false },
  { label: '公募基金（代销）', active: false },
  { label: '理财产品（代销）', active: false }
]);

// 产品列表数据
const productList = ref([
  {
    name: '汇丰代客境外理财计划-汇丰欧元区价值基金 - 美元对冲 - 累计 | 自有',
    isNew: true,
    rate: '+27.67%',
    rateLabel: '近1年',
    status: '开放申购/认购',
    detail: '风险水平 3 | CNY100,000起购'
  },
  {
    name: '汇丰代客境外理财计划 - 骏利亨德森环球生命科技基金 - 人民币对冲 - 累计 | 自有',
    isNew: true
  }
]);

/** 转账活动 */
const onTransfer = () => {
  uni.showToast({ title: '转账功能', icon: 'none' });
};

/** 开立账户 */
const onOpenAccount = () => {
  uni.navigateTo({ url: '/pages/home/AccountOpen' });
};

/** 联系我们 */
const onContact = () => {
  uni.showToast({ title: '联系我们', icon: 'none' });
};

/** 产品标签切换 */
const onTabClick = (index: number) => {
  productTabs.value.forEach((tab, i) => {
    tab.active = i === index;
  });
  // 这里可以根据不同的标签加载不同的产品列表
  // uni.showToast({ title: `切换到${productTabs.value[index].label}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
.hsbc-home-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

// 顶部导航栏
.top-bar {
  background: #db0011;
  padding: 32rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-bar {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
}

.top-icons {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

// 快捷功能区
.quick-actions {
  background: #e8f0f8;
  padding: 32rpx 24rpx;
  display: flex;
  justify-content: space-around;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.action-icon {
  width: 88rpx;
  height: 88rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.action-label {
  font-size: 22rpx;
  color: #333;
}

// 公告区
.notice-section {
  background: #fff;
  margin: 24rpx 32rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.notice-badge {
  background: #db0011;
  color: #fff;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 24rpx;
  color: #333;
  line-height: 1.5;
}

// Banner 轮播
.banner-section {
  margin: 0 32rpx 24rpx;
  position: relative;
}

.banner-swiper {
  height: 380rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-item {
  position: relative;
  height: 100%;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: #fff;
}

.banner-title {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.banner-subtitle {
  font-size: 24rpx;
  display: block;
  margin-bottom: 24rpx;
  opacity: 0.9;
}

.banner-button {
  background: #db0011;
  color: #fff;
  font-size: 24rpx;
  padding: 16rpx 32rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.banner-dots {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 16rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #d9d9d9;

  &.active {
    background: #db0011;
  }
}

// 产品推荐区
.product-section {
  background: #fff;
  margin: 0 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.product-tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 2rpx solid #f0f0f0;
  padding: 0 24rpx;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  font-size: 24rpx;
  color: #666;
  padding: 24rpx 16rpx;
  white-space: nowrap;
  flex-shrink: 0;
  border-bottom: 4rpx solid transparent;

  &.active {
    color: #db0011;
    font-weight: 600;
    border-bottom-color: #db0011;
  }
}

.product-list {
  padding: 24rpx;
}

.product-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.product-header {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.product-name {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
}

.product-tag {
  background: #fff5f5;
  color: #db0011;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  border: 1rpx solid #ffccc7;
  flex-shrink: 0;

  &.new {
    background: #fff5f5;
    color: #db0011;
  }
}

.product-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-rate {
  display: flex;
  flex-direction: column;
}

.rate-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #db0011;
}

.rate-label {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}

.product-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status-label {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.status-detail {
  font-size: 20rpx;
  color: #999;
}

// 底部导航栏
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  padding: 16rpx 0 calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.nav-label {
  font-size: 20rpx;
  color: #666;

  &.active {
    color: #db0011;
    font-weight: 500;
  }
}
</style>
