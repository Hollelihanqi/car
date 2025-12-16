export interface ClipboardCheckOptions {
  onMatch?: (text: string) => void;
}

/**
 * 强力清空剪贴板
 */
export const clearClipboardSilently = async (): Promise<void> => {
  try {
    if (typeof plus === 'undefined') return;
    const systemInfo = uni.getSystemInfoSync();

    if (systemInfo.platform === 'android') {
      const main: any = plus.android.runtimeMainActivity();
      const Context: any = plus.android.importClass('android.content.Context');
      const clipboard: any = main.getSystemService(Context.CLIPBOARD_SERVICE);

      // 尝试调用 clearPrimaryClip (API 28+)
      try {
        plus.android.invoke(clipboard, 'clearPrimaryClip');
      } catch {
        // 旧版本回退方案：设置空文本
        const ClipData: any = plus.android.importClass('android.content.ClipData');
        const emptyClip: any = ClipData.newPlainText('', ''); // Label和Text都为空
        plus.android.invoke(clipboard, 'setPrimaryClip', emptyClip);
      }
    } else if (systemInfo.platform === 'ios') {
      const UIPasteboard = plus.ios.importClass('UIPasteboard');
      const pasteboard = UIPasteboard.generalPasteboard();
      // iOS 清空比较彻底
      pasteboard.setValueforPasteboardType(null, 'public.utf8-plain-text');
      pasteboard.setString('');
    }
  } catch (err) {
    console.warn('清空剪贴板失败', err);
  }
};

export function useClipboardCheck(options: ClipboardCheckOptions = {}) {
  const { onMatch } = options;

  const checkHasContent = (): boolean => {
    try {
      if (typeof plus === 'undefined') return false;
      const systemInfo = uni.getSystemInfoSync();

      if (systemInfo.platform === 'android') {
        const main: any = plus.android.runtimeMainActivity();
        const Context: any = plus.android.importClass('android.content.Context');
        const clipboard: any = main.getSystemService(Context.CLIPBOARD_SERVICE);

        const hasClip = plus.android.invoke(clipboard, 'hasPrimaryClip');
        if (!hasClip) return false;

        // 【新增优化】如果能获取到 Item，判断一下是不是空字符串
        // 虽然我们不想读内容触发隐私提示，但检查 Item 长度通常不会触发
        /* 
           注意：为了绝对隐私安全，这里仍然只做类型检查。
           只要上面 clearClipboardSilently 执行成功，hasPrimaryClip 下次就会返回 false (或者内容为空)
        */

        const description = plus.android.invoke(clipboard, 'getPrimaryClipDescription');
        const ClipDescription: any = plus.android.importClass('android.content.ClipDescription');
        const hasPlain = plus.android.invoke(description, 'hasMimeType', ClipDescription.MIMETYPE_TEXT_PLAIN);
        const hasHtml = plus.android.invoke(description, 'hasMimeType', ClipDescription.MIMETYPE_TEXT_HTML);

        return hasPlain || hasHtml;
      } else if (systemInfo.platform === 'ios') {
        const UIPasteboard = plus.ios.importClass('UIPasteboard');
        const generalPasteboard: any = UIPasteboard.generalPasteboard();
        return generalPasteboard.hasStrings();
      }
    } catch {
      return false;
    }
    return false;
  };

  const readClipboard = (): void => {
    uni.getClipboardData({
      success: (res) => {
        const text = res.data;
        // 立即清空
        clearClipboardSilently();

        if (text && typeof onMatch === 'function') {
          onMatch(text);
        }
      },
      fail: (err) => {
        console.error('剪贴板读取失败', err);
        // 读取失败也要清空，防止死循环
        clearClipboardSilently();
      }
    });
  };

  return {
    checkHasContent,
    readClipboard,
    clearClipboardSilently
  };
}
