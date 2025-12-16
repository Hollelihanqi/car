<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCredentialStore, useVerificationStore } from '@/stores';
import { useCredentialClipboard } from '@/hooks/useCredentialClipboard';
const credentialStore = useCredentialStore();
const verificationStore = useVerificationStore();

// 初始化凭证剪贴板检测，自动弹窗提示
const { checkCredentialClipboard } = useCredentialClipboard({
  onMatch: (text) => {
    console.log('[Clipboard] 检测到凭证，开始处理:', text);
    // 将剪贴板内容交给凭证处理逻辑（使用剪切板专用函数，直接跳转）
    credentialStore.handleClipboardCredential(text);
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

  // 检查剪贴板是否有凭证内容
  setTimeout(() => {
    checkCredentialClipboard();
  }, 500);

  // #ifdef APP-PLUS
  const args: any = plus.runtime.arguments;
  console.log('回调参数', args);

  // 获取当前页面路径
  // const pages = getCurrentPages();
  // const currentPage = pages[pages.length - 1];
  // const currentRoute = currentPage ? `/${currentPage.route}` : '';
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
    return;
  }
  // #endif
});

onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
