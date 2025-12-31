<template>
  <view class="tabbar-wrapper">
    <view class="tabbar-container">
      <view
        v-for="item in tabList"
        :key="item.path"
        class="tab-item"
        :class="{ active: currentPath === item.path }"
        @click="switchTab(item.path)"
      >
        <view class="tab-icon-wrapper">
          <text class="tab-icon">{{ item.icon }}</text>
        </view>
        <text class="tab-label">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface TabItem {
  path: string;
  text: string;
  icon: string;
}

const tabList: TabItem[] = [
  {
    path: '/pages/index/index',
    text: '拼车大厅',
    icon: '🚗'
  },
  {
    path: '/pages/publish/publish',
    text: '发布',
    icon: '➕'
  },
  {
    path: '/pages/mine/mine',
    text: '我的',
    icon: '👤'
  }
];

const currentPath = ref('');

// 获取当前页面路径
const updateCurrentPath = () => {
  try {
    const pages = getCurrentPages();
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1] as any;
      const route = currentPage.route || currentPage.$page?.fullPath || '';
      currentPath.value = route.startsWith('/') ? route : '/' + route;
    }
  } catch (error) {
    console.warn('获取当前页面路径失败:', error);
  }
};

// 切换 Tab
const switchTab = (path: string) => {
  if (currentPath.value === path) return;

  // 使用 switchTab 切换到 tabBar 页面
  uni.switchTab({
    url: path,
    fail: (err) => {
      console.log('switchTab 失败，尝试 redirectTo', err);
      // 如果 switchTab 失败，说明可能不是 tabBar 页面，使用 redirectTo
      uni.redirectTo({
        url: path,
        fail: () => {
          console.log('redirectTo 失败，尝试 navigateTo');
          uni.navigateTo({
            url: path,
            fail: () => {
              console.log('navigateTo 失败');
            }
          });
        }
      });
    }
  });
};

onMounted(() => {
  updateCurrentPath();
});

// 监听页面切换
onActivated(() => {
  updateCurrentPath();
});
</script>

<style lang="scss" scoped>
.tabbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  pointer-events: none;
  padding: 0 32rpx 24rpx;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.tabbar-container {
  pointer-events: auto;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px);
  border-radius: 999px;
  padding: 8rpx 20rpx;
  box-shadow:
    0 8rpx 32rpx rgba(255, 107, 0, 0.12),
    0 2rpx 8rpx rgba(255, 107, 0, 0.08);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .tab-icon-wrapper {
    position: relative;
    margin-bottom: 6rpx;

    .tab-icon {
      font-size: 44rpx;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: block;
    }
  }

  .tab-label {
    font-size: 22rpx;
    color: #999;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.active {
    .tab-icon-wrapper {
      .tab-icon {
        transform: scale(1.15);
        filter: drop-shadow(0 2rpx 8rpx rgba(255, 107, 0, 0.4));
      }
    }

    .tab-label {
      color: #ff6b00;
      font-weight: 600;
    }
  }

  &:active {
    transform: scale(0.92);
  }
}
</style>
