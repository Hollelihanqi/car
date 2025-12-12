// hooks/usePageHeight.ts
import { ref, onMounted } from 'vue';

export function usePageHeight() {
  const pageHeight = ref(0);
  const windowWidth = ref(0);
  const statusBarHeight = ref(0);
  const safeAreaBottom = ref(0); // 新增

  const getSystemInfo = () => {
    try {
      const systemInfo = uni.getSystemInfoSync();
      pageHeight.value = systemInfo.windowHeight;
      windowWidth.value = systemInfo.windowWidth;
      statusBarHeight.value = systemInfo.statusBarHeight || 0;

      // 获取底部安全区高度
      if (systemInfo.safeAreaInsets) {
        safeAreaBottom.value = systemInfo.safeAreaInsets.bottom || 0;
      }
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  };

  onMounted(() => {
    getSystemInfo();
    // 监听窗口尺寸变化（如旋转屏幕），适配 H5 或平板
    // #ifdef H5
    window.addEventListener('resize', getSystemInfo);
    // #endif
  });

  // #ifdef H5
  onUnmounted(() => {
    window.removeEventListener('resize', getSystemInfo);
  });
  // #endif

  return {
    pageHeight,
    windowWidth,
    statusBarHeight,
    safeAreaBottom,
    refresh: getSystemInfo
  };
}
