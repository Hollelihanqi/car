<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCredentialStore, useVerificationStore } from '@/stores';
// import { useCredentialClipboard } from '@/hooks/useCredentialClipboard';
import { useCredentialClipboard } from '@/hooks/useCredentialClipboard2';
const credentialStore = useCredentialStore();
const verificationStore = useVerificationStore();

// 初始化检测 Hook
const { checkCredentialClipboard } = useCredentialClipboard({
  // 关键：跳过第一次（启动页期间不弹窗）
  skipFirstCheck: true,

  // 验证通过后的回调
  onMatch: (text) => {
    console.log('[Clipboard] 校验通过，开始导入');
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

  // 检查剪贴板是否有凭证内容
  setTimeout(() => {
    checkCredentialClipboard();
  }, 300);
});

onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
