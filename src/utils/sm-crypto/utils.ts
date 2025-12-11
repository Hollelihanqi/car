/**
 * 字符串转 Uint8Array (UTF-8 编码)
 * 兼容处理：优先使用 TextEncoder，如果没有则使用手动转换
 */
export function utf8ToArray(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }

  // Polyfill for environments without TextEncoder
  const arr: number[] = [];
  for (let i = 0, len = str.length; i < len; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      arr.push(charCode);
    } else if (charCode < 0x800) {
      arr.push(0xc0 | (charCode >> 6));
      arr.push(0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      arr.push(0xe0 | (charCode >> 12));
      arr.push(0x80 | ((charCode >> 6) & 0x3f));
      arr.push(0x80 | (charCode & 0x3f));
    } else {
      // Surrogate pair
      i++;
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      arr.push(0xf0 | (charCode >> 18));
      arr.push(0x80 | ((charCode >> 12) & 0x3f));
      arr.push(0x80 | ((charCode >> 6) & 0x3f));
      arr.push(0x80 | (charCode & 0x3f));
    }
  }
  return new Uint8Array(arr);
}

/**
 * Uint8Array 转 Hex 字符串
 */
export function arrayToHex(arr: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < arr.length; i++) {
    const b = arr[i];
    if (b < 16) hex += '0';
    hex += b.toString(16);
  }
  return hex;
}

/**
 * Hex 字符串转 Uint8Array
 */
export function hexToArray(hexStr: string): Uint8Array {
  if (!hexStr || hexStr.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const len = hexStr.length;
  const arr = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    arr[i / 2] = parseInt(hexStr.substring(i, i + 2), 16);
  }
  return arr;
}
