<template>
  <PageContainer>
    <view class="mine-container">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="card-background"></view>
        <view class="card-content">
          <view class="user-info">
            <view class="avatar-wrapper">
              <image class="avatar" :src="userInfo.avatarUrl || defaultAvatar" mode="aspectFill" />
              <view class="avatar-border"></view>
            </view>
            <view class="info-content">
              <view class="nickname">{{ userInfo.nickName }}</view>
              <view class="phone">
                <text class="phone-icon">📱</text>
                <text>{{ userInfo.phone || '138****8888' }}</text>
              </view>
            </view>
          </view>
          <view class="stats">
            <view class="stat-item">
              <view class="stat-icon">📊</view>
              <view class="stat-content">
                <view class="value">{{ userInfo.publishCount || 5 }}</view>
                <view class="label">发布次数</view>
              </view>
            </view>
            <view class="divider"></view>
            <view class="stat-item">
              <view class="stat-icon">⭐</view>
              <view class="stat-content">
                <view class="value">{{ userInfo.creditScore || 100 }}</view>
                <view class="label">信用分</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 我的发布 -->
      <view class="section">
        <view class="section-header" @click="goToHistory">
          <view class="section-title">
            <view class="title-wrapper">
              <text class="icon">📝</text>
              <text class="text">我的发布</text>
            </view>
            <view class="right-section">
              <view class="count-badge">{{ myList.length }}</view>
              <text class="arrow">›</text>
            </view>
          </view>
        </view>
        <view v-if="myList.length > 0" class="my-list">
          <view v-for="item in myList" :key="item.id" class="list-item" @click="goToDetail(item.id)">
            <view class="item-content">
              <view class="item-header">
                <view class="left-section">
                  <view class="type-badge" :class="item.type">
                    <text class="badge-icon">{{ item.type === 'offer' ? '🚗' : '🙋' }}</text>
                    <text class="badge-text">{{ item.type === 'offer' ? '车找人' : '人找车' }}</text>
                  </view>
                  <view class="status-badge" :class="item.status">
                    <view class="status-dot"></view>
                    <text>{{ statusMap[item.status] }}</text>
                  </view>
                </view>
                <view class="item-actions">
                  <button
                    v-if="item.status === 'active'"
                    class="action-btn cancel-btn"
                    @click.stop="handleCancel(item.id)"
                  >
                    取消
                  </button>
                  <button class="action-btn delete-btn" @click.stop="handleDelete(item.id)">删除</button>
                </view>
              </view>
              <view class="item-route">
                <view class="route-point start">
                  <view class="point-dot"></view>
                  <text class="location">{{ item.fromLocation }}</text>
                </view>
                <view class="route-line"></view>
                <view class="route-point end">
                  <view class="point-dot"></view>
                  <text class="location">{{ item.toLocation }}</text>
                </view>
              </view>
              <view class="item-meta">
                <view class="meta-item">
                  <text class="meta-icon">🕐</text>
                  <text class="time">{{ item.departureTime }}</text>
                </view>
                <view class="meta-item">
                  <text class="meta-icon">�</text>
                  <text class="count">{{ item.viewCount }} 浏览</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无发布记录</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="section menu-section">
        <view class="menu-item" @click="handleBindPhone">
          <view class="menu-left">
            <view class="menu-icon-wrapper phone">
              <text class="menu-icon">📱</text>
            </view>
            <view class="menu-info">
              <text class="menu-text">绑定手机号</text>
              <text class="menu-desc">绑定后可接收消息通知</text>
            </view>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="handleAbout">
          <view class="menu-left">
            <view class="menu-icon-wrapper info">
              <text class="menu-icon">ℹ️</text>
            </view>
            <view class="menu-info">
              <text class="menu-text">关于我们</text>
              <text class="menu-desc">了解更多信息</text>
            </view>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- TabBar -->
    <TabBar />
  </PageContainer>
</template>

<script setup lang="ts">
import type { CarPoolInfo, UserInfo } from '@/typings/carpool';
// import { getUserInfo, getMyCarPoolList, cancelCarPool, deleteCarPool } from '@/api/carpool';
import PageContainer from '@/components/PageContainer.vue';
import TabBar from '@/components/TabBar.vue';
defineOptions({
  name: 'MinePage'
});

const defaultAvatar =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

const userInfo = ref<Partial<UserInfo>>({
  nickName: '',
  avatarUrl: '',
  phone: '',
  creditScore: 100,
  publishCount: 0
});

const myList = ref<CarPoolInfo[]>([]);

const statusMap: Record<string, string> = {
  active: '进行中',
  expired: '已过期',
  cancelled: '已取消'
};

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // TODO: 实际调用云函数API
    // const res = await getUserInfo()
    // userInfo.value = res

    // 模拟数据
    userInfo.value = {
      nickName: '微信用户',
      avatarUrl: defaultAvatar,
      phone: '138****8888',
      creditScore: 100,
      publishCount: 5
    };
  } catch (error) {
    console.error('加载用户信息失败', error);
  }
};

// 加载我的发布列表
const loadMyList = async () => {
  try {
    // TODO: 实际调用云函数API
    // const res = await getMyCarPoolList({ page: 1, pageSize: 20 })
    // myList.value = res.list

    // 模拟数据
    myList.value = [
      {
        id: '1',
        type: 'offer',
        fromLocation: '西安市内',
        toLocation: '西咸新区',
        departureTime: '今天 18:00',
        seats: 2,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 156
      },
      {
        id: '2',
        type: 'request',
        fromLocation: '西咸新区',
        toLocation: '高新区',
        departureTime: '明天 08:00',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 89
      }
    ];
  } catch (error) {
    console.error('加载发布列表失败', error);
  }
};

// 取消拼车
const handleCancel = (id: string) => {
  console.log('取消拼车ID:', id);
  uni.showModal({
    title: '提示',
    content: '确定要取消这条拼车信息吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // TODO: 实际调用云函数API
          // await cancelCarPool(id)

          uni.showToast({
            title: '取消成功',
            icon: 'success'
          });
          loadMyList();
        } catch (error) {
          console.error('取消失败', error);
          uni.showToast({
            title: '取消失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 删除拼车
const handleDelete = (id: string) => {
  console.log('取消拼车ID:', id);
  uni.showModal({
    title: '提示',
    content: '确定要删除这条拼车信息吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // TODO: 实际调用云函数API
          // await deleteCarPool(id)

          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          loadMyList();
        } catch (error) {
          console.error('删除失败', error);
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 跳转到详情
const goToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  });
};

// 跳转到发布历史
const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/history/history'
  });
};

// 绑定手机号
const handleBindPhone = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

// 关于我们
const handleAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '上下班拼车小程序\n\n专为西安市内-西咸新区通勤人员打造的拼车信息发布平台。\n\n安全、便捷、环保。',
    showCancel: false
  });
};

onMounted(() => {
  loadUserInfo();
  loadMyList();
});
</script>

<style lang="scss" scoped>
:deep(.page-container) {
  padding-bottom: 150rpx;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

.mine-container {
  min-height: 100vh;
}

.user-card {
  position: relative;
  margin: 24rpx 24rpx 32rpx;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 0, 0.2);

  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 50%, #ffa726 100%);
    opacity: 1;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 300rpx;
      height: 300rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      filter: blur(80rpx);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -10%;
      width: 250rpx;
      height: 250rpx;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      filter: blur(60rpx);
    }
  }

  .card-content {
    position: relative;
    padding: 48rpx 32rpx 40rpx;
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36rpx;

    .avatar-wrapper {
      position: relative;
      margin-right: 28rpx;

      .avatar {
        width: 140rpx;
        height: 140rpx;
        border-radius: 70rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
      }

      .avatar-border {
        position: absolute;
        top: -4rpx;
        left: -4rpx;
        right: -4rpx;
        bottom: -4rpx;
        border-radius: 74rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.3);
      }
    }

    .info-content {
      display: flex;
      flex-direction: column;

      .nickname {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 12rpx;
        text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }

      .phone {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.9);

        .phone-icon {
          font-size: 24rpx;
        }
      }
    }
  }

  .stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20rpx);
    border-radius: 24rpx;
    padding: 32rpx 20rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.3);

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16rpx;
      flex: 1;
      justify-content: center;

      .stat-icon {
        font-size: 32rpx;
        filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
      }

      .stat-content {
        display: flex;
        flex-direction: column;

        .value {
          font-size: 36rpx;
          font-weight: bold;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 4rpx;
          text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        }

        .label {
          font-size: 22rpx;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .divider {
      width: 1rpx;
      height: 60rpx;
      background: rgba(255, 255, 255, 0.4);
    }
  }
}

.section {
  background: #fff;
  border-radius: 24rpx;
  margin: 0 24rpx 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);

  .section-header {
    padding: 32rpx 32rpx 28rpx;
    background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
    cursor: pointer;
    transition: all 0.2s;

    &:active {
      background: #f5f5f5;
    }

    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title-wrapper {
        display: flex;
        align-items: center;

        .icon {
          font-size: 32rpx;
          margin-right: 12rpx;
        }

        .text {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }
      }

      .right-section {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .count-badge {
          min-width: 48rpx;
          height: 48rpx;
          background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%);
          border-radius: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16rpx;
          font-size: 24rpx;
          font-weight: bold;
          color: #fff;
          box-shadow: 0 4rpx 12rpx rgba(255, 107, 0, 0.25);
        }

        .arrow {
          font-size: 48rpx;
          color: #d0d0d0;
          font-weight: 300;
          line-height: 1;
        }
      }
    }
  }
}

.my-list {
  padding: 24rpx;
  list-style: none;

  .list-item {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    border: 1rpx solid #f0f0f0;
    transition: all 0.3s;
    list-style: none;

    &:last-child {
      margin-bottom: 0;
    }

    &:active {
      transform: scale(0.98);
      box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.08);
    }

    .item-content {
      width: 100%;

      .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .left-section {
          display: flex;
          align-items: center;
          gap: 12rpx;
        }

        .type-badge {
          display: flex;
          align-items: center;
          gap: 8rpx;
          padding: 10rpx 18rpx;
          border-radius: 20rpx;
          font-size: 22rpx;

          &.offer {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);

            .badge-icon {
              font-size: 24rpx;
            }

            .badge-text {
              color: #e65100;
              font-weight: 600;
            }
          }

          &.request {
            background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);

            .badge-icon {
              font-size: 24rpx;
            }

            .badge-text {
              color: #c62828;
              font-weight: 600;
            }
          }
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8rpx;
          padding: 10rpx 18rpx;
          border-radius: 20rpx;
          font-size: 22rpx;
          font-weight: 600;

          .status-dot {
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;
          }

          &.active {
            background: #fff3e0;
            color: #ff6b00;

            .status-dot {
              background: #ff6b00;
              box-shadow: 0 0 8rpx rgba(255, 107, 0, 0.5);
            }
          }

          &.expired {
            background: #f5f5f5;
            color: #999;

            .status-dot {
              background: #999;
            }
          }

          &.cancelled {
            background: #ffebee;
            color: #f44336;

            .status-dot {
              background: #f44336;
            }
          }
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .action-btn {
            padding: 0;
            margin: 0;
            background: transparent;
            border: none;
            font-size: 26rpx;
            font-weight: 500;
            line-height: 1;

            &::after {
              border: none;
            }

            &:active {
              opacity: 0.6;
            }

            &.cancel-btn {
              color: #ff6b00;
            }

            &.delete-btn {
              color: #f44336;
            }
          }
        }
      }

      .item-route {
        margin-bottom: 16rpx;

        .route-point {
          display: flex;
          align-items: center;
          gap: 12rpx;
          margin-bottom: 8rpx;

          .point-dot {
            width: 16rpx;
            height: 16rpx;
            border-radius: 50%;
            flex-shrink: 0;
          }

          &.start .point-dot {
            background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
            box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
          }

          &.end .point-dot {
            background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%);
            box-shadow: 0 2rpx 8rpx rgba(255, 107, 0, 0.3);
          }

          .location {
            font-size: 28rpx;
            color: #333;
            font-weight: 600;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        .route-line {
          width: 2rpx;
          height: 20rpx;
          background: linear-gradient(to bottom, #e0e0e0 0%, #bdbdbd 100%);
          margin-left: 7rpx;
          margin-bottom: 8rpx;
        }
      }

      .item-meta {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          color: #999;

          .meta-icon {
            font-size: 22rpx;
          }
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 24rpx;
    opacity: 0.5;
    filter: grayscale(0.3);
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.menu-section {
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
    transition: all 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: #fafafa;
    }

    .menu-left {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .menu-icon-wrapper {
        width: 72rpx;
        height: 72rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;

        &.phone {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        }

        &.info {
          background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
        }
      }

      .menu-info {
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .menu-text {
          font-size: 28rpx;
          color: #333;
          font-weight: 600;
        }

        .menu-desc {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    .menu-arrow {
      font-size: 48rpx;
      color: #d0d0d0;
      font-weight: 300;
      line-height: 1;
    }
  }
}
</style>
