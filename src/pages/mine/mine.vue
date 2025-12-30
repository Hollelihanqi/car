<template>
  <PageContainer>
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatarUrl || defaultAvatar" mode="aspectFill" />
        <view class="info">
          <view class="nickname">{{ userInfo.nickName || '微信用户' }}</view>
          <view class="phone">{{ userInfo.phone || '未绑定手机号' }}</view>
        </view>
      </view>
      <view class="stats">
        <view class="stat-item">
          <view class="value">{{ userInfo.publishCount || 0 }}</view>
          <view class="label">发布次数</view>
        </view>
        <view class="divider"></view>
        <view class="stat-item">
          <view class="value">{{ userInfo.creditScore || 100 }}</view>
          <view class="label">信用分</view>
        </view>
      </view>
    </view>

    <!-- 我的发布 -->
    <view class="section">
      <view class="section-header">
        <view class="title">
          <text class="icon">📝</text>
          <text class="text">我的发布</text>
        </view>
      </view>
      <view v-if="myList.length > 0" class="my-list">
        <view v-for="item in myList" :key="item.id" class="list-item" @click="goToDetail(item.id)">
          <view class="item-header">
            <view class="type-tag" :class="item.type">
              {{ item.type === 'offer' ? '车找人' : '人找车' }}
            </view>
            <view class="status" :class="item.status">
              {{ statusMap[item.status] }}
            </view>
          </view>
          <view class="item-content">
            <view class="route">
              <text>{{ item.fromLocation }}</text>
              <text class="arrow">→</text>
              <text>{{ item.toLocation }}</text>
            </view>
            <view class="time">{{ item.departureTime }}</view>
          </view>
          <view class="item-actions">
            <view class="view-count">👁 {{ item.viewCount }}</view>
            <view class="action-btns">
              <button v-if="item.status === 'active'" class="action-btn cancel" @click.stop="handleCancel(item.id)">
                取消
              </button>
              <button class="action-btn delete" @click.stop="handleDelete(item.id)">删除</button>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无发布记录</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section">
      <view class="menu-list">
        <view class="menu-item" @click="handleBindPhone">
          <view class="menu-left">
            <text class="icon">📱</text>
            <text class="text">绑定手机号</text>
          </view>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="handleAbout">
          <view class="menu-left">
            <text class="icon">ℹ️</text>
            <text class="text">关于我们</text>
          </view>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="handleContact">
          <view class="menu-left">
            <text class="icon">📞</text>
            <text class="text">联系客服</text>
          </view>
          <text class="arrow">›</text>
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

// 联系客服
const handleContact = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服微信：carpoolhelp\n工作时间：9:00-18:00',
    confirmText: '复制微信号',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: 'carpoolhelp',
          success: () => {
            uni.showToast({
              title: '已复制',
              icon: 'success'
            });
          }
        });
      }
    }
  });
};

onMounted(() => {
  loadUserInfo();
  loadMyList();
});
</script>

<style lang="scss" scoped>
:deep(.page-container) {
  padding-bottom: 150rpx; // 留出TabBar空间
}

.user-card {
  background: linear-gradient(135deg, #62a9c8 0%, #147ebc 100%);
  padding: 60rpx 30rpx 40rpx;
  margin-bottom: 20rpx;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      margin-right: 30rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
    }

    .info {
      flex: 1;

      .nickname {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
      }

      .phone {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    padding: 30rpx 0;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .value {
        font-size: 40rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
      }

      .label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .divider {
      width: 1rpx;
      height: 60rpx;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.section {
  margin-bottom: 20rpx;

  .section-header {
    padding: 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .title {
      display: flex;
      align-items: center;

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
}

.my-list {
  background-color: #fff;

  .list-item {
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .type-tag {
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        font-weight: bold;

        &.offer {
          background-color: #e8f5e9;
          color: #4caf50;
        }

        &.request {
          background-color: #e3f2fd;
          color: #2196f3;
        }
      }

      .status {
        font-size: 24rpx;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;

        &.active {
          background-color: #fff3e0;
          color: #ff9800;
        }

        &.expired {
          background-color: #f5f5f5;
          color: #999;
        }

        &.cancelled {
          background-color: #ffebee;
          color: #f44336;
        }
      }
    }

    .item-content {
      margin-bottom: 20rpx;

      .route {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;

        .arrow {
          margin: 0 10rpx;
          color: #999;
        }
      }

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .item-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .view-count {
        font-size: 24rpx;
        color: #999;
      }

      .action-btns {
        display: flex;
        gap: 20rpx;

        .action-btn {
          padding: 8rpx 24rpx;
          font-size: 24rpx;
          border-radius: 20rpx;
          border: none;

          &::after {
            border: none;
          }

          &.cancel {
            background-color: #fff3e0;
            color: #ff9800;
          }

          &.delete {
            background-color: #ffebee;
            color: #f44336;
          }
        }
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  background-color: #fff;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.menu-list {
  background-color: #fff;

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .menu-left {
      display: flex;
      align-items: center;

      .icon {
        font-size: 36rpx;
        margin-right: 20rpx;
      }

      .text {
        font-size: 28rpx;
        color: #333;
      }
    }

    .arrow {
      font-size: 40rpx;
      color: #ccc;
    }
  }
}
</style>
