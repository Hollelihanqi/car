<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCredentialStore, useVerificationStore } from '@/stores';
// import { useCredentialClipboard } from '@/hooks/useCredentialClipboard';
import { useCredentialClipboard } from '@/hooks/useCredentialClipboard2';

const credentialStore = useCredentialStore();
const verificationStore = useVerificationStore();

// 记录是否是第一次启动（onLaunch 时设置）
let isFirstLaunch = true;

// 初始化检测 Hook（只在一处初始化）
const { checkCredentialClipboard } = useCredentialClipboard({
  skipFirstCheck: false, // 不使用 skipFirstCheck，我们自己控制

  // 验证通过后的回调
  onMatch: (text) => {
    console.log('[Clipboard] 校验通过，开始导入');
    credentialStore.handleClipboardCredential(text);
  }
});

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

  // 检查剪贴板是否有凭证内容
  // 延迟检查，确保页面已经加载完成（避免在启动页时检测）
  const delay = isFirstLaunch ? 1500 : 500; // 第一次启动延迟更长时间
  if (isFirstLaunch) {
    isFirstLaunch = false; // 标记已不是第一次启动
  }

  setTimeout(() => {
    // 检查页面栈，确保不在启动页
    try {
      const pages = getCurrentPages();
      if (pages.length === 0) {
        console.log('页面栈为空（启动页），跳过剪贴板检测');
        return;
      }

      const currentPage = pages[pages.length - 1];
      const currentRoute = currentPage.route || '';

      // 如果当前路由为空，说明还在启动页，不检测
      if (!currentRoute || currentRoute === '') {
        console.log('当前路由为空（启动页），跳过剪贴板检测');
        return;
      }

      // 只有在有有效路由时才检测剪贴板
      checkCredentialClipboard();
    } catch (error) {
      console.warn('检查页面状态失败，跳过剪贴板检测:', error);
    }
  }, delay);
});

onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
