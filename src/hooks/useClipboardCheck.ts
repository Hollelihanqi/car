import { onShow } from '@dcloudio/uni-app';

export interface ClipboardCheckOptions {
  onMatch?: (text: string) => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useClipboardCheck(options: ClipboardCheckOptions = {}) {
  const {
    onMatch,
    title = '提示',
    content = '检测到手机号档案凭证，是否导入？',
    confirmText = '导入',
    cancelText = '取消'
  } = options;

  /**
   * Android Native 检测逻辑 (已修复反射调用问题)
   */
  const androidHasClipText = (): boolean => {
    try {
      if (typeof plus === 'undefined') return false;

      const main: any = plus.android.runtimeMainActivity();
      const Context: any = plus.android.importClass('android.content.Context');
      // 获取剪贴板服务对象

      const clipboard: any = main.getSystemService(Context.CLIPBOARD_SERVICE);

      /**
       * 修复点：使用 plus.android.invoke 反射调用
       * 解决 "clipboard.hasPrimaryClip is not a function" 报错
       */
      const hasClip = plus.android.invoke(clipboard, 'hasPrimaryClip');

      if (!hasClip) return false;

      // 获取 ClipDescription
      const description = plus.android.invoke(clipboard, 'getPrimaryClipDescription');
      const ClipDescription: any = plus.android.importClass('android.content.ClipDescription');

      // 继续使用 invoke 检查 MIME 类型，确保稳健性
      const hasPlain = plus.android.invoke(description, 'hasMimeType', ClipDescription.MIMETYPE_TEXT_PLAIN);
      const hasHtml = plus.android.invoke(description, 'hasMimeType', ClipDescription.MIMETYPE_TEXT_HTML);

      return hasPlain || hasHtml;
    } catch (e) {
      console.error('Android Clipboard Check Error: ', e);
      return false;
    }
  };

  /**
   * iOS Native 检测逻辑
   */
  const iosHasClipText = (): boolean => {
    try {
      if (typeof plus === 'undefined') return false;

      const UIPasteboard = plus.ios.importClass('UIPasteboard');

      const generalPasteboard: any = UIPasteboard.generalPasteboard();
      return generalPasteboard.hasStrings();
    } catch (e) {
      console.error('iOS Clipboard Check Error: ', e);
      return false;
    }
  };

  const readClipboard = (): void => {
    uni.getClipboardData({
      success: (res) => {
        // console.log('剪贴板读取成功:', res.data);
        if (typeof onMatch === 'function' && res.data) {
          onMatch(res.data);
        }
        // 读取后清空，避免重复弹窗 (可选)
        // uni.setClipboardData({ data: '' });
      },
      fail: (err) => {
        console.error('剪贴板读取失败', err);
      }
    });
  };

  const checkAndPrompt = (): void => {
    const systemInfo = uni.getSystemInfoSync();
    let hasContent = false;

    if (systemInfo.platform === 'android') {
      hasContent = androidHasClipText();
    } else if (systemInfo.platform === 'ios') {
      hasContent = iosHasClipText();
    }

    if (!hasContent) return;

    uni.showModal({
      title,
      content,
      cancelText,
      confirmText,
      success: (res) => {
        if (res.confirm) {
          readClipboard();
        }
      }
    });
  };

  onShow(() => {
    // #ifdef APP-PLUS
    // checkAndPrompt();
    // #endif
  });

  return {
    checkAndPrompt
  };
}
