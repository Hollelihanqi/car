import { useClipboardCheck, clearClipboardSilently } from './useClipboardCheck2';
import { isValidCredential } from '@/utils';
import { useVerificationStore } from '@/stores';

// =========================================================
// 全局变量区 (Module Scope)
// 这些变量在 App 生命周期内是单例的，所有页面共享
// =========================================================

// 记录是否是 App 第一次启动
let isAppFirstLaunch = true;

// 【核心修复】全局互斥锁：记录当前是否正在显示弹窗
// 防止 App.vue 和 Home.vue 同时触发导致双重弹窗
let isGlobalShowingModal = false;

interface CredentialClipboardOptions {
  onMatch?: (text: string) => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  skipFirstCheck?: boolean;
}

export const useCredentialClipboard = (options: CredentialClipboardOptions = {}) => {
  const {
    onMatch,
    title = '提示',
    content = '检测到手机号档案凭证，是否一键粘贴？',
    confirmText = '导入',
    cancelText = '取消',
    skipFirstCheck = false
  } = options;

  const handleReadSuccess = (text: string) => {
    clearClipboardSilently();
    if (!text) return;

    if (isValidCredential(text)) {
      if (onMatch) onMatch(text);
    } else {
      uni.showToast({ title: '剪贴板内容格式不正确', icon: 'none' });
    }
  };

  const { checkHasContent, readClipboard } = useClipboardCheck({
    onMatch: handleReadSuccess
  });

  const checkCredentialClipboard = () => {
    // 1. 如果当前已经有弹窗在显示了，直接退出！
    if (isGlobalShowingModal) {
      console.log('全局锁生效：已有弹窗正在显示，跳过本次检测');
      return;
    }

    // 2. 检查页面栈是否已准备好（避免在启动页时检测）
    try {
      const pages = getCurrentPages();
      // 如果页面栈为空，说明还在启动页，不检测
      if (pages.length === 0) {
        console.log('页面栈为空（启动页），跳过剪贴板检测');
        return;
      }

      const currentPage = pages[pages.length - 1];
      const currentRoute = currentPage.route || '';

      // 如果当前路由为空或不是有效页面，说明还在启动页，不检测
      if (!currentRoute || currentRoute === '') {
        console.log('当前路由为空（启动页），跳过剪贴板检测');
        return;
      }

      // 检查是否在 CredentialVerify 页面且正在验证
      if (currentRoute === 'pages/home/CredentialVerify') {
        const verificationStore = useVerificationStore();
        // 判断是否正在验证：isVerifying 为 true 或者验证项还未全部完成
        const isVerifying = verificationStore.isVerifying;
        const allItemsComplete = verificationStore.verifyItems.every(
          (item) =>
            item.status === 'success' ||
            item.status === 'error' ||
            item.status === 'stopped' ||
            item.status === 'api-error'
        );
        // 如果正在验证中（isVerifying 为 true 或验证项未全部完成），不显示弹窗
        if (isVerifying || !allItemsComplete) {
          console.log('正在验证中，跳过剪贴板检测');
          return;
        }
      }
    } catch (error) {
      console.warn('检查当前页面状态失败:', error);
      // 如果检查失败，为了安全起见，不进行检测
      return;
    }

    // 3. 冷启动跳过逻辑（如果设置了 skipFirstCheck）
    if (skipFirstCheck && isAppFirstLaunch) {
      isAppFirstLaunch = false;
      return;
    }
    // 无论是否设置了 skipFirstCheck，都更新标志
    if (isAppFirstLaunch) isAppFirstLaunch = false;

    // 4. 检测是否有内容
    const hasContent = checkHasContent();
    if (!hasContent) return;

    // =====================================
    // 4. 准备弹窗，上锁！
    // =====================================
    isGlobalShowingModal = true;

    uni.showModal({
      title,
      content,
      confirmText,
      cancelText,
      success: (res) => {
        if (res.confirm) {
          readClipboard();
        } else {
          console.log('用户取消，清空剪贴板');
          clearClipboardSilently();
        }
      },
      fail: () => {
        clearClipboardSilently();
      },
      complete: () => {
        // =====================================
        // 5. 弹窗关闭（无论确认、取消还是异常），解锁！
        // =====================================
        //稍微延迟一点解锁，防止快速双击或逻辑重叠
        setTimeout(() => {
          isGlobalShowingModal = false;
        }, 300);
      }
    });
  };

  return {
    checkCredentialClipboard
  };
};
