<template>
  <PageContainer>
    <view v-if="detail" class="detail-container">
      <!-- 类型标签 -->
      <view class="type-header">
        <view class="header-top">
          <view class="type-badge" :class="detail.type">
            <text class="badge-icon">{{ detail.type === 'offer' ? '🚗' : '🙋' }}</text>
            <text class="badge-text">{{ detail.type === 'offer' ? '车找人' : '人找车' }}</text>
          </view>
          <view class="view-count">
            <text class="view-icon">👁</text>
            <text class="view-text">{{ detail.viewCount }}次浏览</text>
          </view>
        </view>
        <view class="header-bottom">
          <text class="publish-time">发布于 {{ formatTime(detail.createTime) }}</text>
        </view>
      </view>

      <!-- 路线信息 -->
      <view class="info-section">
        <view class="section-title">
          <text class="icon">📍</text>
          <text class="text">路线信息</text>
        </view>
        <view class="route-info">
          <view class="route-item from">
            <view class="dot"></view>
            <view class="location">
              <view class="label">出发</view>
              <view class="value">{{ detail.fromLocation }}</view>
            </view>
          </view>
          <view class="route-line"></view>
          <view class="route-item to">
            <view class="dot"></view>
            <view class="location">
              <view class="label">到达</view>
              <view class="value">{{ detail.toLocation }}</view>
            </view>
          </view>
        </view>
        <view class="time-info">
          <text class="icon">⏰</text>
          <text class="text">{{ detail.departureTime }}</text>
        </view>
        <view v-if="detail.seats && detail.type === 'offer'" class="seats-info">
          <text class="icon">👥</text>
          <text class="text">剩余座位：{{ detail.seats }}人</text>
        </view>
      </view>

      <!-- 备注说明 -->
      <view v-if="detail.remark" class="info-section">
        <view class="section-title">
          <text class="icon">📝</text>
          <text class="text">备注说明</text>
        </view>
        <view class="remark-content">{{ detail.remark }}</view>
      </view>

      <!-- 联系方式 -->
      <view class="info-section">
        <view class="section-title">
          <text class="icon">📞</text>
          <text class="text">联系方式</text>
        </view>
        <view class="contact-info">
          <view class="contact-item">
            <text class="label">姓名</text>
            <text class="value">{{ detail.contact.name }}</text>
          </view>
          <view class="contact-item phone" @click="makePhoneCall">
            <text class="label">电话</text>
            <text class="value">{{ detail.contact.phone }}</text>
            <text class="action">📞 拨打</text>
          </view>
          <view v-if="detail.contact.wechat" class="contact-item" @click="copyWechat">
            <text class="label">微信</text>
            <text class="value">{{ detail.contact.wechat }}</text>
            <text class="action">📋 复制</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-else-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="action-btn primary" open-type="contact">
        <text class="icon">💬</text>
        <text class="text">发消息</text>
      </button>
      <button class="action-btn success" @click="makePhoneCall">
        <text class="icon">📞</text>
        <text class="text">打电话</text>
      </button>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import type { CarPoolInfo } from '@/typings/carpool';
// import { getCarPoolDetail, increaseViewCount } from '@/api/carpool'
import PageContainer from '@/components/PageContainer.vue';
defineOptions({
  name: 'DetailPage'
});

const detail = ref<CarPoolInfo | null>(null);
const loading = ref(true);

// 加载详情
const loadDetail = async (id: string) => {
  loading.value = true;
  try {
    // TODO: 实际调用云函数API
    // const res = await getCarPoolDetail(id)
    // detail.value = res
    // await increaseViewCount(id)

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500));
    detail.value = {
      id,
      type: 'offer',
      fromLocation: '西安市内',
      toLocation: '西咸新区',
      departureTime: '12月30日 18:00',
      seats: 2,
      contact: {
        name: '张三',
        phone: '13800138000',
        wechat: 'zhangsan123'
      },
      remark: '长期拼车，每天下班准时出发。车况良好，安全第一。',
      userId: 'user-1',
      createTime: new Date().toISOString(),
      status: 'active',
      viewCount: 156
    };
  } catch (error) {
    console.error('加载详情失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 拨打电话
const makePhoneCall = () => {
  if (!detail.value) return;

  uni.makePhoneCall({
    phoneNumber: detail.value.contact.phone,
    fail: (error) => {
      console.error('拨打电话失败', error);
      uni.showToast({
        title: '拨打失败',
        icon: 'none'
      });
    }
  });
};

// 复制微信号
const copyWechat = () => {
  if (!detail.value?.contact.wechat) return;

  uni.setClipboardData({
    data: detail.value.contact.wechat,
    success: () => {
      uni.showToast({
        title: '已复制微信号',
        icon: 'success'
      });
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'none'
      });
    }
  });
};

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

// 页面加载时获取详情
onLoad((options: any) => {
  if (options.id) {
    loadDetail(options.id);
  } else {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
});
</script>

<style lang="scss" scoped>
:deep(.page-container) {
  padding-bottom: 140rpx;
  background: linear-gradient(180deg, #f5f7fa 0%, #fff 100%);
}

.detail-container {
  padding: 24rpx;
}

.type-header {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .type-badge {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 16rpx 32rpx;
    border-radius: 24rpx;
    font-size: 28rpx;

    &.offer {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      color: #e65100;
    }

    &.request {
      background: linear-gradient(135deg, #fff0f0 0%, #ffe5e5 100%);
      color: #ff5252;
    }

    .badge-icon {
      font-size: 36rpx;
    }

    .badge-text {
      font-weight: 700;
      font-size: 30rpx;
    }
  }

  .view-count {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    background: #f8f8f8;
    border-radius: 20rpx;

    .view-icon {
      font-size: 24rpx;
    }

    .view-text {
      font-size: 24rpx;
      color: #999;
    }
  }

  .header-bottom {
    padding-top: 20rpx;
    border-top: 1rpx solid #f5f5f5;

    .publish-time {
      font-size: 24rpx;
      color: #999;
      display: flex;
      align-items: center;
    }
  }
}

.info-section {
  background-color: #fff;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    .icon {
      font-size: 32rpx;
      margin-right: 10rpx;
    }

    .text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

.route-info {
  position: relative;
  padding-left: 60rpx;

  .route-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .dot {
      position: absolute;
      left: 0;
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      background-color: #62a9c8;
    }

    &.from .dot {
      background-color: #ff6b00;
    }

    &.to .dot {
      background-color: #ff5252;
    }

    .location {
      .label {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .value {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .route-line {
    position: absolute;
    left: 11rpx;
    top: 30rpx;
    bottom: 50rpx;
    width: 2rpx;
    background-color: #e0e0e0;
  }
}

.time-info,
.seats-info {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  margin-top: 20rpx;

  .icon {
    font-size: 28rpx;
    margin-right: 10rpx;
  }

  .text {
    font-size: 28rpx;
    color: #333;
  }
}

.remark-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.contact-info {
  .contact-item {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 120rpx;
      font-size: 28rpx;
      color: #666;
    }

    .value {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .action {
      font-size: 26rpx;
      color: #ff6b00;
      padding: 8rpx 20rpx;
      background-color: #fff3e0;
      border-radius: 20rpx;
    }

    &.phone {
      .action {
        color: #ff6b00;
        background-color: #fff3e0;
      }
    }
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
  font-size: 28rpx;
  color: #999;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);

  .action-btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: bold;
    border: none;

    &::after {
      border: none;
    }

    .icon {
      font-size: 36rpx;
      margin-right: 10rpx;
    }

    &.primary {
      background-color: #ff6b00;
      color: #fff;
    }

    &.success {
      background-color: #4caf50;
      color: #fff;
    }
  }
}
</style>
