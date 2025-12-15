export interface ClipboardCheckOptions {
  onMatch?: (text: string) => void;
}

/**
 * 静默清空剪贴板（不弹出"已复制"提示）
 */
export const clearClipboardSilently = async (): Promise<void> => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.platform === 'android' && typeof plus !== 'undefined') {
      const main: any = plus.android.runtimeMainActivity();
      const Context: any = plus.android.importClass('android.content.Context');
      const clipboard: any = main.getSystemService(Context.CLIPBOARD_SERVICE);
      const ClipData: any = plus.android.importClass('android.content.ClipData');
      const emptyClip: any = ClipData.newPlainText('label', '');
      plus.android.invoke(clipboard, 'setPrimaryClip', emptyClip);
      return;
    }

    if (systemInfo.platform === 'ios' && typeof plus !== 'undefined') {
      const UIPasteboard = plus.ios.importClass('UIPasteboard');
      const pasteboard = UIPasteboard.generalPasteboard();
      pasteboard.setValueforPasteboardType('', 'public.utf8-plain-text');
      // 防止内存泄漏
      plus.ios.deleteObject(pasteboard);
      return;
    }

    // H5 或其他平台尝试使用 Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText('');
    }
  } catch (err) {
    console.warn('清空剪贴板失败（已忽略）：', err);
  }
};

export function useClipboardCheck(options: ClipboardCheckOptions = {}) {
  const { onMatch } = options;

  /**
   * Android Native 检测逻辑 (已修复反射调用问题)
   */
  const androidHasClipText = (): boolean => {
    try {
      if (typeof plus === 'undefined') return false;

      const main: any = plus.android.runtimeMainActivity();
      const Context: any = plus.android.importClass('android.content.Context');
      const clipboard: any = main.getSystemService(Context.CLIPBOARD_SERVICE);

      const hasClip = plus.android.invoke(clipboard, 'hasPrimaryClip');
      if (!hasClip) return false;

      const description = plus.android.invoke(clipboard, 'getPrimaryClipDescription');
      const ClipDescription: any = plus.android.importClass('android.content.ClipDescription');

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

  /**
   * 读取剪贴板并触发回调（会清空剪贴板）
   */
  const readClipboard = (presetText?: string): void => {
    const handleData = (text: string) => {
      if (!text) return;
      if (typeof onMatch === 'function') {
        onMatch(text);
      }
      // 处理完成后立即清空剪贴板，避免重复弹窗
      clearClipboardSilently();
    };

    if (typeof presetText === 'string') {
      handleData(presetText);
      return;
    }

    uni.getClipboardData({
      success: (res) => {
        handleData(res.data);
      },
      fail: (err) => {
        console.error('剪贴板读取失败', err);
      }
    });
  };

  /**
   * 读取当前剪贴板文本，读取后立即清空剪贴板，避免重复弹窗
   * 由调用方决定后续行为（显示弹窗等）
   */
  const getClipboardTextIfNew = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const systemInfo = uni.getSystemInfoSync();
      let hasContent = false;

      if (systemInfo.platform === 'android') {
        hasContent = androidHasClipText();
      } else if (systemInfo.platform === 'ios') {
        hasContent = iosHasClipText();
      }

      if (!hasContent) {
        resolve(null);
        return;
      }

      uni.getClipboardData({
        success: (clip) => {
          const currentText = clip.data || '';
          if (!currentText) {
            resolve(null);
            return;
          }
          // 读取后立即清空剪贴板，避免重复检测
          clearClipboardSilently();
          resolve(currentText);
        },
        fail: (err) => {
          console.error('剪贴板读取失败', err);
          resolve(null);
        }
      });
    });
  };

  return {
    getClipboardTextIfNew,
    readClipboard,
    clearClipboardSilently
  };
}
