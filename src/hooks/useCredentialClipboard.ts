import { useClipboardCheck } from './useClipboardCheck';
import { isValidCredential } from '@/utils';

interface CredentialClipboardOptions {
  onMatch?: (text: string) => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * 凭证内容剪贴板检测
 * - 检测到剪贴板内容时显示弹窗提示（读取后已自动清空剪贴板）
 * - 点击导入时进行格式验证，验证失败则提示
 * - 弹窗和业务逻辑由此文件负责，基础探测逻辑在 useClipboardCheck
 */
export const useCredentialClipboard = (options: CredentialClipboardOptions = {}) => {
  const {
    onMatch,
    title = '提示',
    content = '检测到手机号档案凭证，是否导入？',
    confirmText = '导入',
    cancelText = '取消'
  } = options;

  const { getClipboardTextIfNew, readClipboard } = useClipboardCheck({
    onMatch
  });

  /**
   * 业务弹窗逻辑：在页面/组件里调用
   * 注意：getClipboardTextIfNew 读取后已自动清空剪贴板，避免重复弹窗
   */
  const checkCredentialClipboard = () => {
    getClipboardTextIfNew().then((text) => {
      if (!text) return;

      // 直接显示弹窗，不做格式验证
      // 剪贴板已在 getClipboardTextIfNew 中清空，不会重复弹窗
      uni.showModal({
        title,
        content,
        confirmText,
        cancelText,
        success: (res) => {
          if (res.confirm) {
            // 点击导入时进行格式验证
            if (!isValidCredential(text)) {
              uni.showToast({
                title: '凭证格式不正确，无法导入',
                icon: 'none',
                duration: 2000
              });
              return;
            }
            // 验证通过，处理凭证（readClipboard 内部会再次清空，确保清空）
            readClipboard(text);
          }
          // 取消时不需要额外处理，剪贴板已在读取时清空
        }
      });
    });
  };

  return {
    checkCredentialClipboard
  };
};
