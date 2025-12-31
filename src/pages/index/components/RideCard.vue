<template>
  <view class="ride-card" :class="item.type" @click="handleClick">
    <!-- 卡片头部 -->
    <view class="card-header">
      <view class="type-badge" :class="item.type">
        <text class="badge-icon">{{ item.type === 'offer' ? '🚗' : '🙋' }}</text>
        <text class="badge-text">{{ item.type === 'offer' ? '车找人' : '人找车' }}</text>
      </view>
      <text class="card-time">出发时间: {{ formatTime(item.departureTime) }}</text>
    </view>

    <!-- 路线信息 -->
    <view class="route-info">
      <view class="route-row">
        <view class="route-point from">
          <text class="point-dot"></text>
          <text class="point-text">{{ item.fromLocation }}</text>
        </view>
        <view class="route-arrow">→</view>
        <view class="route-point to">
          <text class="point-dot"></text>
          <text class="point-text">{{ item.toLocation }}</text>
        </view>
      </view>
    </view>

    <!-- 卡片底部 -->
    <view class="card-footer">
      <view class="user-info">
        <view class="user-avatar">{{ item.contact.name.charAt(0) }}</view>
        <text class="user-name">{{ item.contact.name }}</text>
      </view>
      <view v-if="item.contact.wechat" class="wechat-info" @click.stop="copyWechat">
        <text class="wechat-label">微信:</text>
        <text class="wechat-text" selectable>{{ item.contact.wechat }}</text>
        <text class="copy-hint">（点击复制）</text>
      </view>
      <view class="call-btn" @click.stop="handleCall">
        <text class="call-icon">📞</text>
        <text class="call-text">拨号</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CarPoolInfo } from '@/typings/carpool';

interface Props {
  item: CarPoolInfo;
}

interface Emits {
  (e: 'click', id: string): void;
  (e: 'call', phone: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click', props.item.id);
};

const handleCall = () => {
  emit('call', props.item.contact.phone);
};

// 复制微信号
const copyWechat = () => {
  if (props.item.contact.wechat) {
    uni.setClipboardData({
      data: props.item.contact.wechat,
      success: () => {
        uni.showToast({
          title: '已复制微信号',
          icon: 'success'
        });
      }
    });
  }
};

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hour}:${minute}`;
};
</script>

<style lang="scss" scoped>
.ride-card {
  position: relative;
  background: #faedd1;
  border-radius: 24rpx;
  padding: 28rpx;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.95;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .type-badge {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 10rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;

    &.offer {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      color: #e65100;
    }

    &.request {
      background: linear-gradient(135deg, #fff0f0 0%, #ffe5e5 100%);
      color: #ff5252;
    }

    .badge-icon {
      font-size: 28rpx;
    }

    .badge-text {
      font-weight: 600;
    }
  }

  .card-time {
    font-size: 24rpx;
    color: #ff6b00;
    font-weight: 500;
  }
}

.route-info {
  margin-bottom: 20rpx;

  .route-row {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .route-arrow {
    color: #999;
    font-weight: bold;
  }

  .route-point {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .point-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .point-text {
      font-size: 30rpx;
      color: #333;
      font-weight: 600;
    }

    &.from .point-dot {
      background: #ff6b00;
      box-shadow: 0 0 0 4rpx rgba(255, 107, 0, 0.15);
    }

    &.to .point-dot {
      background: #ff5252;
      box-shadow: 0 0 0 4rpx rgba(255, 82, 82, 0.15);
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;

  .user-info {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .user-avatar {
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffcc80 0%, #ff6b00 100%);
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-size: 26rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .wechat-info {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx 16rpx;
    border-radius: 16rpx;
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }

    .wechat-label {
      font-size: 24rpx;
      color: #666;
    }

    .wechat-text {
      font-size: 24rpx;
      color: #07c160;
      font-weight: 500;
    }

    .copy-hint {
      font-size: 20rpx;
      color: #999;
    }
  }

  .call-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border-radius: 30rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
      opacity: 0.9;
    }

    .call-icon {
      font-size: 24rpx;
    }

    .call-text {
      font-size: 24rpx;
      color: #e65100;
      font-weight: 600;
    }
  }
}
</style>
