<template>
  <PageContainer>
    <!-- 顶部筛选区 -->
    <FilterSection
      v-model:activeTab="activeTab"
      v-model:fromIndex="fromIndex"
      v-model:toIndex="toIndex"
      :locations="locations"
      @refresh="refreshList"
    />

    <!-- 列表区域 -->
    <scroll-view class="list-container" scroll-y :lower-threshold="50" @scrolltolower="loadMore">
      <view v-if="list.length > 0" class="list-content">
        <RideCard v-for="item in list" :key="item.id" :item="item" @click="goToDetail" @call="handleCall" />
      </view>

      <!-- 空状态 -->
      <EmptyState v-else-if="!loading" />

      <!-- 加载状态 -->
      <LoadMore v-if="list.length > 0 || loading" :loading="loading" :has-more="hasMore" />
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
import FilterSection from './components/FilterSection.vue';
import RideCard from './components/RideCard.vue';
import EmptyState from './components/EmptyState.vue';
import LoadMore from './components/LoadMore.vue';

defineOptions({
  name: 'IndexPage'
});

// 标签页
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

// 跳转到详情
const goToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  });
};

// 拨打电话
const handleCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  });
};

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
        phone: '138****' + String(1000 + index).slice(-4),
        wechat: '微信' + names[index % 5]
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
  height: 100vh;
  overflow: hidden;
}

// 列表容器
.list-container {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
  height: 0;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
}
</style>
