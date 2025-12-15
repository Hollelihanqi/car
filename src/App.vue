<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCredentialStore, useVerificationStore } from '@/stores';
import { useClipboardCheck } from '@/hooks/useClipboardCheck';
const credentialStore = useCredentialStore();
const verificationStore = useVerificationStore();

// 初始化剪贴板监听
useClipboardCheck({
  // text 会被自动推断为 string 类型
  onMatch: (text) => {
    console.log('Hook回调 - 获取到内容:', text);

    // 业务逻辑示例：
    // if (text.startsWith('http')) { ... }
  }
});

onLaunch(() => {
  console.log('App Launch - 重置状态');
  // 重置凭证状态
  credentialStore.clearCredential();
  // 重置验证状态
  verificationStore.resetVerification();
});

onShow(async () => {
  console.log('App Show');
  // #ifdef APP-PLUS
  const args = plus.runtime.arguments;
  console.log('回调参数', args);

  // 获取当前页面路径
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentRoute = currentPage ? `/${currentPage.route}` : '';

  if (!args) {
    // 如果当前不在首页，使用 reLaunch 清空页面栈并跳转到首页
    if (currentRoute !== '/pages/home/Index') {
      uni.reLaunch({ url: '/pages/home/Index' });
    }
    return;
  }

  // 处理凭证参数
  credentialStore.handleCredentialArgs(args);
  // if (success) {
  //   uni.navigateTo({ url: '/pages/home/CredentialInfo' });
  // }
  // #endif
});

onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
