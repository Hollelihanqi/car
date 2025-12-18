<!--
 * @Author: zhoudandan
 * @Date: 2025-12-17 10:12:21
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-18 14:43:46
 * @Description: Description
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCredentialStore, useVerificationStore } from '@/stores';
// import { useCredentialClipboard } from '@/hooks/useCredentialClipboard';

const credentialStore = useCredentialStore();
const verificationStore = useVerificationStore();

// 记录是否是第一次启动（onLaunch 时设置）
let isFirstLaunch = true;

onLaunch(() => {
  console.log('App Launch - 重置状态');
  isFirstLaunch = true; // 标记为第一次启动
  // 重置凭证状态
  credentialStore.clearCredential();
  // 重置验证状态
  verificationStore.resetVerification();
});

onShow(async () => {
  console.log('App Show');

  // #ifdef APP-PLUS
  const args: any = plus.runtime.arguments;
  console.log('回调参数', args);

  if (args) {
    try {
      const data = JSON.parse(args);
      const status = data.status;
      if (status == 0 || status == 2) {
        uni.reLaunch({ url: '/pages/home/Index' });
      } else {
        // 处理凭证参数
        credentialStore.handleCredentialArgs(args);
      }
    } catch (error) {
      console.error('解析认证参数失败:', error);
    }
    // 处理完 args 后，清空 plus.runtime.arguments，避免下次 onShow 时还有值
    // 注意：清空后继续执行剪贴板检测逻辑
    plus.runtime.arguments = undefined;
  }
  // #endif

  if (isFirstLaunch) {
    isFirstLaunch = false;
  }
});

onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
