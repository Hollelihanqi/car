<template>
  <PageContainer>
    <view class="history-container">
      <!-- 顶部标题栏 -->
      <view class="header">
        <view class="header-content">
          <view class="back-btn" @click="goBack">
            <text class="back-icon">‹</text>
          </view>
          <view class="header-title">我的发布</view>
          <view class="placeholder"></view>
        </view>
        <!-- 筛选标签 -->
        <view class="filter-tabs">
          <view
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: currentTab === tab.value }"
            @click="changeTab(tab.value)"
          >
            <text class="tab-text">{{ tab.label }}</text>
            <view v-if="currentTab === tab.value" class="tab-indicator"></view>
          </view>
        </view>
      </view>

      <!-- 发布列表 -->
      <view v-if="filteredList.length > 0" class="history-list">
        <view v-for="item in filteredList" :key="item.id" class="list-item" @click="goToDetail(item.id)">
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
                <text class="meta-icon">👁</text>
                <text class="count">{{ item.viewCount }} 浏览</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">{{ emptyText }}</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import type { CarPoolInfo } from '@/typings/carpool';
import PageContainer from '@/components/PageContainer.vue';

defineOptions({
  name: 'HistoryPage'
});

const tabs = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'active' },
  { label: '已过期', value: 'expired' },
  { label: '已取消', value: 'cancelled' }
];

const currentTab = ref('all');
const myList = ref<CarPoolInfo[]>([]);

const statusMap: Record<string, string> = {
  active: '进行中',
  expired: '已过期',
  cancelled: '已取消'
};

// 筛选后的列表
const filteredList = computed(() => {
  if (currentTab.value === 'all') {
    return myList.value;
  }
  return myList.value.filter((item) => item.status === currentTab.value);
});

// 空状态文案
const emptyText = computed(() => {
  const textMap: Record<string, string> = {
    all: '暂无发布记录',
    active: '暂无进行中的发布',
    expired: '暂无已过期的发布',
    cancelled: '暂无已取消的发布'
  };
  return textMap[currentTab.value] || '暂无记录';
});

// 切换标签
const changeTab = (value: string) => {
  currentTab.value = value;
};

// 返回
const goBack = () => {
  uni.switchTab({
    url: '/pages/mine/mine'
  });
};

// 跳转到详情
const goToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  });
};

// 取消拼车
const handleCancel = (id: string) => {
  console.log(id);
  uni.showModal({
    title: '提示',
    content: '确定要取消这条拼车信息吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // TODO: 实际调用云函数API
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
  console.log(id);
  uni.showModal({
    title: '提示',
    content: '确定要删除这条拼车信息吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // TODO: 实际调用云函数API
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

// 加载我的发布列表
const loadMyList = async () => {
  try {
    // TODO: 实际调用云函数API
    // const res = await getMyCarPoolList({ page: 1, pageSize: 100 })
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
      },
      {
        id: '3',
        type: 'offer',
        fromLocation: '雁塔区',
        toLocation: '曲江新区',
        departureTime: '今天 20:30',
        seats: 3,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 203
      },
      {
        id: '4',
        type: 'request',
        fromLocation: '长安区',
        toLocation: '电子城',
        departureTime: '明天 09:30',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 142
      },
      {
        id: '5',
        type: 'offer',
        fromLocation: '高新区',
        toLocation: '西安市内',
        departureTime: '昨天 18:00',
        seats: 3,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 234
      },
      {
        id: '6',
        type: 'request',
        fromLocation: '经开区',
        toLocation: '浐灞生态区',
        departureTime: '昨天 14:00',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 178
      },
      {
        id: '7',
        type: 'offer',
        fromLocation: '未央区',
        toLocation: '高新区',
        departureTime: '2天前 17:30',
        seats: 2,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 298
      },
      {
        id: '8',
        type: 'request',
        fromLocation: '西咸新区',
        toLocation: '长安区',
        departureTime: '2天前 08:00',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'cancelled',
        viewCount: 67
      },
      {
        id: '9',
        type: 'offer',
        fromLocation: '曲江新区',
        toLocation: '西咸新区',
        departureTime: '3天前 19:00',
        seats: 4,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'cancelled',
        viewCount: 112
      },
      {
        id: '10',
        type: 'request',
        fromLocation: '航天基地',
        toLocation: '雁塔区',
        departureTime: '4天前 10:30',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'cancelled',
        viewCount: 45
      },
      {
        id: '11',
        type: 'offer',
        fromLocation: '临潼区',
        toLocation: '西安市内',
        departureTime: '5天前 16:00',
        seats: 3,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 189
      },
      {
        id: '12',
        type: 'request',
        fromLocation: '高新区',
        toLocation: '咸阳市',
        departureTime: '1周前 07:30',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 321
      },
      {
        id: '13',
        type: 'offer',
        fromLocation: '小寨',
        toLocation: '西安北站',
        departureTime: '后天 06:30',
        seats: 3,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 276
      },
      {
        id: '14',
        type: 'request',
        fromLocation: '钟楼',
        toLocation: '大雁塔',
        departureTime: '明天 15:00',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 198
      },
      {
        id: '15',
        type: 'offer',
        fromLocation: '西咸机场',
        toLocation: '钟楼',
        departureTime: '今天 22:00',
        seats: 2,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 412
      },
      {
        id: '16',
        type: 'request',
        fromLocation: '大学城',
        toLocation: '软件园',
        departureTime: '明天 08:30',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 157
      },
      {
        id: '17',
        type: 'offer',
        fromLocation: '碑林区',
        toLocation: '浐灞半岛',
        departureTime: '昨天 10:00',
        seats: 3,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 134
      },
      {
        id: '18',
        type: 'request',
        fromLocation: '灞桥区',
        toLocation: '莲湖区',
        departureTime: '3天前 13:00',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'expired',
        viewCount: 89
      },
      {
        id: '19',
        type: 'offer',
        fromLocation: '航天城',
        toLocation: '钟楼',
        departureTime: '6天前 18:30',
        seats: 2,
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'cancelled',
        viewCount: 223
      },
      {
        id: '20',
        type: 'request',
        fromLocation: '西安南站',
        toLocation: '西咸新区',
        departureTime: '1周前 21:00',
        contact: {
          name: '张三',
          phone: '13800138000'
        },
        userId: 'user-1',
        createTime: new Date().toISOString(),
        status: 'cancelled',
        viewCount: 76
      }
    ];
  } catch (error) {
    console.error('加载发布列表失败', error);
  }
};

onMounted(() => {
  loadMyList();
});
</script>

<style lang="scss" scoped>
:deep(.page-container) {
  background: #f5f7fa;
}

.history-container {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 101;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 24rpx;

    .back-btn {
      width: 64rpx;
      height: 64rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;

      &:active {
        background: #f5f5f5;
      }

      .back-icon {
        font-size: 56rpx;
        font-weight: 300;
        color: #333;
        line-height: 1;
      }
    }

    .header-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .placeholder {
      width: 64rpx;
    }
  }
}

.filter-tabs {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  //   position: sticky;
  //   top: 112rpx;
  //   z-index: 100;

  .tab-item {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx 0;
    cursor: pointer;
    transition: all 0.2s;

    .tab-text {
      font-size: 28rpx;
      color: #666;
      transition: all 0.2s;
    }

    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48rpx;
      height: 6rpx;
      background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%);
      border-radius: 3rpx;
    }

    &.active {
      .tab-text {
        color: #ff6b00;
        font-weight: bold;
      }
    }
  }
}

.history-list {
  padding: 0 24rpx;
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
  padding: 150rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.5;
    filter: grayscale(0.3);
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
