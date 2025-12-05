import { defineStore } from 'pinia';

export const useAppStore = defineStore(
  'app',
  () => {
    // ==================== State ====================

    return {};
  },
  {
    // 启用持久化（使用 pinia-plugin-persist-uni）
    persist: {
      enabled: true
    }
  }
);
