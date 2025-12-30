<template>
  <PageContainer>
    <!-- 顶部筛选区 -->
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
          <picker :value="fromIndex" :range="locations" @change="handleFromChange">
            <view class="route-picker">
              <view class="picker-dot start"></view>
              <view class="picker-content">
                <text class="picker-label">出发地</text>
                <text class="picker-value">{{ locations[fromIndex] }}</text>
              </view>
              <text class="picker-arrow">›</text>
            </view>
          </picker>

          <view class="route-divider"></view>

          <picker :value="toIndex" :range="locations" @change="handleToChange">
            <view class="route-picker">
              <view class="picker-dot end"></view>
              <view class="picker-content">
                <text class="picker-label">目的地</text>
                <text class="picker-value">{{ locations[toIndex] }}</text>
              </view>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 列表区域 -->
    <scroll-view class="list-container" scroll-y :lower-threshold="50" @scrolltolower="loadMore">
      <view v-if="list.length > 0" class="list-content">
        <view v-for="item in list" :key="item.id" class="ride-card" @click="goToDetail(item.id)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="type-badge" :class="item.type">
              <text class="badge-icon">{{ item.type === 'offer' ? '🚗' : '🙋' }}</text>
              <text class="badge-text">{{ item.type === 'offer' ? '车找人' : '人找车' }}</text>
            </view>
            <text class="card-time">{{ formatTime(item.departureTime) }}</text>
          </view>

          <!-- 路线信息 -->
          <view class="route-info">
            <view class="route-row">
              <view class="route-point from">
                <text class="point-dot"></text>
                <text class="point-text">{{ item.fromLocation }}</text>
              </view>
            </view>
            <view class="route-line-wrapper">
              <view class="route-line-inner"></view>
            </view>
            <view class="route-row">
              <view class="route-point to">
                <text class="point-dot"></text>
                <text class="point-text">{{ item.toLocation }}</text>
              </view>
            </view>
          </view>

          <!-- 附加信息 -->
          <view class="card-info">
            <view v-if="item.seats && item.type === 'offer'" class="info-item seats">
              <text class="info-icon">💺</text>
              <text class="info-text">剩余{{ item.seats }}座</text>
            </view>
            <view v-if="item.remark" class="info-item remark">
              <text class="remark-text">{{ item.remark }}</text>
            </view>
          </view>

          <!-- 卡片底部 -->
          <view class="card-footer">
            <view class="user-info">
              <view class="user-avatar">{{ item.contact.name.charAt(0) }}</view>
              <text class="user-name">{{ item.contact.name }}</text>
            </view>
            <view class="footer-meta">
              <text class="meta-views">👁 {{ item.viewCount }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading" class="empty-state">
        <text class="empty-icon">🚗</text>
        <text class="empty-text">暂无拼车信息</text>
        <text class="empty-hint">快去发布一条吧~</text>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <text>加载中...</text>
      </view>
      <view v-else-if="!hasMore && list.length > 0" class="no-more-state">
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <!-- TabBar -->
    <TabBar />
  </PageContainer>
</template>

<script setup lang="ts">
import type { CarPoolInfo, FilterParams } from '@/typings/carpool';
// import { getCarPoolList } from '@/api/carpool';
import PageContainer from '@/components/PageContainer.vue';
import TabBar from '@/components/TabBar.vue';
defineOptions({
  name: 'IndexPage'
});

// 标签页
const tabs = [
  { label: '全部', value: 'all' },
  { label: '车找人', value: 'offer' },
  { label: '人找车', value: 'request' }
];
const activeTab = ref<string>('all');

// 地点选择
const locations = ['全部', '西安市内', '西咸新区', '高新区', '曲江新区', '经开区', '浐灞新区'];
const fromIndex = ref(0);
const toIndex = ref(0);

// 列表数据
const list = ref<CarPoolInfo[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const page = ref(1);
const pageSize = 20;

// 切换标签
const handleTabChange = (value: string) => {
  activeTab.value = value;
  refreshList();
};

// 选择出发地
const handleFromChange = (e: any) => {
  fromIndex.value = e.detail.value;
  refreshList();
};

// 选择目的地
const handleToChange = (e: any) => {
  toIndex.value = e.detail.value;
  refreshList();
};

// 刷新列表
const refreshList = () => {
  page.value = 1;
  hasMore.value = true;
  list.value = [];
  loadList();
};

// 加载列表
const loadList = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const params: FilterParams & { page: number; pageSize: number } = {
      page: page.value,
      pageSize
    };

    if (activeTab.value !== 'all') {
      params.type = activeTab.value as 'offer' | 'request';
    }

    if (fromIndex.value > 0) {
      params.fromLocation = locations[fromIndex.value];
    }

    if (toIndex.value > 0) {
      params.toLocation = locations[toIndex.value];
    }

    // TODO: 实际调用云函数API
    // const res = await getCarPoolList(params)
    // list.value = [...list.value, ...res.list]
    // hasMore.value = res.hasMore

    // 模拟数据
    const mockData = generateMockData(page.value, pageSize);
    list.value = [...list.value, ...mockData];
    hasMore.value = page.value < 3; // 模拟只有3页数据
  } catch (error) {
    console.error('加载列表失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    page.value++;
    loadList();
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

// 跳转到详情
const goToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  });
};

// 跳转到发布页
// const goToPublish = () => {
//   uni.switchTab({
//     url: '/pages/publish/publish'
//   });
// };

// 生成模拟数据
const generateMockData = (page: number, size: number): CarPoolInfo[] => {
  const data: CarPoolInfo[] = [];
  const types: ('offer' | 'request')[] = ['offer', 'request'];
  const fromLocations = ['西安市内', '高新区', '曲江新区'];
  const toLocations = ['西咸新区', '经开区', '浐灞新区'];
  const names = ['张三', '李四', '王五', '赵六', '钱七'];

  for (let i = 0; i < size; i++) {
    const index = (page - 1) * size + i;
    const type = types[index % 2];
    const now = new Date();
    now.setHours(now.getHours() + index);

    data.push({
      id: `${page}-${i}`,
      type,
      fromLocation: fromLocations[index % 3],
      toLocation: toLocations[index % 3],
      departureTime: now.toISOString(),
      seats: type === 'offer' ? Math.floor(Math.random() * 3) + 1 : undefined,
      contact: {
        name: names[index % 5],
        phone: '138****' + String(1000 + index).slice(-4)
      },
      remark: index % 3 === 0 ? '长期拼车，准时出发' : undefined,
      userId: `user-${index}`,
      createTime: new Date().toISOString(),
      status: 'active',
      viewCount: Math.floor(Math.random() * 100)
    });
  }

  return data;
};

onMounted(() => {
  loadList();
});
</script>

<style lang="scss" scoped>
:deep(.page-container) {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f5f7fa 0%, #fff 100%);
}

// 顶部筛选区域
.header-section {
  flex-shrink: 0;
  padding: 24rpx 24rpx 0;
}

.search-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 8rpx 32rpx rgba(98, 169, 200, 0.08);
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
      background: linear-gradient(135deg, #62a9c8 0%, #147ebc 100%);
      box-shadow: 0 8rpx 24rpx rgba(98, 169, 200, 0.35);
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
  flex-direction: column;
  gap: 16rpx;
}

.route-picker {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  background: linear-gradient(135deg, #f8fbfc 0%, #f3f8fa 100%);
  border-radius: 20rpx;
  border: 2rpx solid rgba(98, 169, 200, 0.1);
  transition: all 0.3s;

  &:active {
    background: linear-gradient(135deg, #f3f8fa 0%, #eef6f9 100%);
    border-color: rgba(98, 169, 200, 0.2);
  }

  .picker-dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    flex-shrink: 0;

    &.start {
      background: linear-gradient(135deg, #62a9c8 0%, #147ebc 100%);
      box-shadow: 0 0 0 6rpx rgba(98, 169, 200, 0.15);
    }

    &.end {
      background: linear-gradient(135deg, #ff8a80 0%, #ff5252 100%);
      box-shadow: 0 0 0 6rpx rgba(255, 82, 82, 0.15);
    }
  }

  .picker-content {
    flex: 1;
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

  .picker-arrow {
    font-size: 40rpx;
    color: #d0d0d0;
    margin-left: 12rpx;
  }
}

.route-divider {
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, #e5e5e5 50%, transparent 100%);
  margin: 0 20rpx;
}

// 列表容器
.list-container {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// 拼车卡片
.ride-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
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
      background: linear-gradient(135deg, #e6f7f9 0%, #d7ecf1 100%);
      color: #147ebc;
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
    color: #999;
  }
}

.route-info {
  margin-bottom: 20rpx;

  .route-row {
    display: flex;
    align-items: center;
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
      background: #62a9c8;
      box-shadow: 0 0 0 4rpx rgba(98, 169, 200, 0.15);
    }

    &.to .point-dot {
      background: #ff5252;
      box-shadow: 0 0 0 4rpx rgba(255, 82, 82, 0.15);
    }
  }

  .route-line-wrapper {
    padding: 12rpx 0 12rpx 6rpx;

    .route-line-inner {
      width: 2rpx;
      height: 32rpx;
      background: linear-gradient(180deg, #62a9c8 0%, #ff5252 100%);
    }
  }
}

.card-info {
  margin-bottom: 20rpx;

  .info-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 12rpx;

    &:last-child {
      margin-bottom: 0;
    }

    &.seats {
      .info-icon {
        font-size: 28rpx;
      }

      .info-text {
        font-size: 26rpx;
        color: #ff9800;
        font-weight: 600;
      }
    }

    &.remark {
      .remark-text {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
      }
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
      background: linear-gradient(135deg, #a8d1e1 0%, #62a9c8 100%);
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .footer-meta {
    .meta-views {
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #999;
  }
}

// 加载状态
.loading-state,
.no-more-state {
  text-align: center;
  padding: 40rpx 0;
  font-size: 26rpx;
  color: #999;
}
</style>
