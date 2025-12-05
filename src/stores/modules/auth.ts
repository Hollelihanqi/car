import { defineStore } from 'pinia';

export const useAuthStore = defineStore(
  'auth',
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
