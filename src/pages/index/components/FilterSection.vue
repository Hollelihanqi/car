<template>
  <view class="header-section">
    <view class="search-card">
      <!-- 类型选择 -->
      <view class="type-selector">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="type-item"
          :class="{ active: activeTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >
          <text class="type-label">{{ tab.label }}</text>
        </view>
      </view>

      <!-- 路线选择器 -->
      <view class="route-wrapper">
        <picker class="route-item" :value="fromIndex" :range="locations" @change="handleFromChange">
          <view class="route-picker">
            <view class="picker-dot start"></view>
            <view class="picker-content">
              <text class="picker-label">出发地</text>
              <text class="picker-value">{{ locations[fromIndex] }}</text>
            </view>
          </view>
        </picker>

        <view class="route-divider">
          <text class="divider-icon">➜</text>
        </view>

        <picker class="route-item" :value="toIndex" :range="locations" @change="handleToChange">
          <view class="route-picker right">
            <view class="picker-content">
              <text class="picker-label">目的地</text>
              <text class="picker-value">{{ locations[toIndex] }}</text>
            </view>
            <view class="picker-dot end"></view>
          </view>
        </picker>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string;
  fromIndex: number;
  toIndex: number;
  locations: string[];
}

interface Emits {
  (e: 'update:activeTab', value: string): void;
  (e: 'update:fromIndex', value: number): void;
  (e: 'update:toIndex', value: number): void;
  (e: 'refresh'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const tabs = [
  { label: '全部', value: 'all' },
  { label: '车找人', value: 'offer' },
  { label: '人找车', value: 'request' }
];

const handleTabChange = (value: string) => {
  emit('update:activeTab', value);
  emit('refresh');
};

const handleFromChange = (e: any) => {
  emit('update:fromIndex', e.detail.value);
  emit('refresh');
};

const handleToChange = (e: any) => {
  emit('update:toIndex', e.detail.value);
  emit('refresh');
};
</script>

<style lang="scss" scoped>
// 顶部筛选区域
.header-section {
  flex-shrink: 0;
  padding: 24rpx 24rpx 0;
}

.search-card {
  background: linear-gradient(180deg, #ffffff 0%, #fffcf9 100%);
  border-radius: 32rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 0, 0.05);
  border: 2rpx solid rgba(255, 255, 255, 0.6);
}

// 类型选择器
.type-selector {
  display: flex;
  gap: 20rpx;
  margin-bottom: 32rpx;

  .type-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    background: linear-gradient(135deg, #f8f9fb 0%, #f0f2f5 100%);
    border-radius: 24rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    .type-label {
      font-size: 28rpx;
      color: #666;
      font-weight: 500;
    }

    &.active {
      background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%);
      box-shadow: 0 8rpx 24rpx rgba(255, 107, 0, 0.35);
      transform: translateY(-2rpx);

      .type-label {
        color: #fff;
        font-weight: 600;
      }
    }

    &:active {
      transform: scale(0.96);
    }
  }
}

// 路线选择器
.route-wrapper {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  background: linear-gradient(135deg, #f8fbfc 0%, #f3f8fa 100%);
  border-radius: 20rpx;
  border: 2rpx solid rgba(98, 169, 200, 0.1);
}

.route-item {
  flex: 1;
}

.route-picker {
  display: flex;
  align-items: center;

  &.right {
    justify-content: flex-end;

    .picker-content {
      align-items: flex-end;
    }

    .picker-dot {
      margin-right: 0;
      margin-left: 20rpx;
    }
  }

  .picker-dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    flex-shrink: 0;

    &.start {
      background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%);
      box-shadow: 0 0 0 6rpx rgba(255, 107, 0, 0.15);
    }

    &.end {
      background: linear-gradient(135deg, #ff8a80 0%, #ff5252 100%);
      box-shadow: 0 0 0 6rpx rgba(255, 82, 82, 0.15);
    }
  }

  .picker-content {
    display: flex;
    flex-direction: column;
    gap: 6rpx;

    .picker-label {
      font-size: 22rpx;
      color: #999;
    }

    .picker-value {
      font-size: 30rpx;
      color: #333;
      font-weight: 600;
    }
  }
}

.route-divider {
  padding: 0 30rpx;

  .divider-icon {
    font-size: 32rpx;
    color: #ccc;
    font-weight: bold;
  }
}
</style>
