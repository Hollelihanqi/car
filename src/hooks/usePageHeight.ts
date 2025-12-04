import { ref, onMounted } from 'vue';

/**
 * 获取页面可用高度（已减去导航栏和状态栏）
 */
export function usePageHeight() {
  const pageHeight = ref(0);
  const windowWidth = ref(0);
  const statusBarHeight = ref(0);

  const getSystemInfo = () => {
    const systemInfo = uni.getSystemInfoSync();
    pageHeight.value = systemInfo.windowHeight;
    windowWidth.value = systemInfo.windowWidth;
    statusBarHeight.value = systemInfo.statusBarHeight || 0;
  };

  onMounted(() => {
    getSystemInfo();
  });

  return {
    pageHeight,
    windowWidth,
    statusBarHeight,
    refresh: getSystemInfo
  };
}
