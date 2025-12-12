/**
 * AES-TypeScript 完整版
 * 基于 CryptoJS 源码 (aes.js + core.js + cipher-core.js + enc-base64.js) 重构
 *
 * 功能：
 * 1. AES 算法核心 (查表法)
 * 2. CBC 分组模式
 * 3. PKCS7 填充
 * 4. Base64 / Hex / Utf8 编码支持
 */

// ==========================================
// 1. Core: WordArray (数据基石)
// ==========================================

export class WordArray {
  words: number[];
  sigBytes: number;

  constructor(words?: number[], sigBytes?: number) {
    this.words = words || [];
    if (sigBytes !== undefined) {
      this.sigBytes = sigBytes;
    } else {
      this.sigBytes = this.words.length * 4;
    }
  }

  static create(words?: number[], sigBytes?: number): WordArray {
    return new WordArray(words, sigBytes);
  }

  /**
   * 移除 sigBytes 之外的多余位，确保位运算安全
   */
  clamp(): void {
    const words = this.words;
    const sigBytes = this.sigBytes;
    words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
    words.length = Math.ceil(sigBytes / 4);
  }

  concat(wordArray: WordArray): WordArray {
    const thisWords = this.words;
    const thatWords = wordArray.words;
    const thisSigBytes = this.sigBytes;
    const thatSigBytes = wordArray.sigBytes;

    this.clamp();

    if (thisSigBytes % 4) {
      for (let i = 0; i < thatSigBytes; i++) {
        const thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
      }
    } else {
      for (let j = 0; j < thatSigBytes; j += 4) {
        thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
      }
    }
    this.sigBytes += thatSigBytes;
    return this;
  }

  clone(): WordArray {
    return new WordArray(this.words.slice(0), this.sigBytes);
  }

  toString(): string {
    return Hex.stringify(this);
  }
}

// ==========================================
// 2. Encoders (编码器)
// ==========================================

// Hex Encoder
export const Hex = {
  stringify(wordArray: WordArray): string {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const hexChars: string[] = [];
    for (let i = 0; i < sigBytes; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      hexChars.push((bite >>> 4).toString(16));
      hexChars.push((bite & 0x0f).toString(16));
    }
    return hexChars.join('');
  },
  parse(hexStr: string): WordArray {
    const hexStrLength = hexStr.length;
    const words: number[] = [];
    for (let i = 0; i < hexStrLength; i += 2) {
      words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
    }
    return new WordArray(words, hexStrLength / 2);
  }
};

// Latin1 (Utf8 的底层依赖)
const Latin1 = {
  stringify(wordArray: WordArray): string {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const latin1Chars: string[] = [];
    for (let i = 0; i < sigBytes; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      latin1Chars.push(String.fromCharCode(bite));
    }
    return latin1Chars.join('');
  },
  parse(latin1Str: string): WordArray {
    const latin1StrLength = latin1Str.length;
    const words: number[] = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    }
    return new WordArray(words, latin1StrLength);
  }
};

// Utf8 Encoder (最常用)
export const Utf8 = {
  stringify(wordArray: WordArray): string {
    try {
      return decodeURIComponent(escape(Latin1.stringify(wordArray)));
    } catch {
      throw new Error('Malformed UTF-8 data');
    }
  },
  parse(utf8Str: string): WordArray {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};

// Base64 Encoder (核心输出格式)
export const Base64 = {
  _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  _reverseMap: null as number[] | null,

  stringify(wordArray: WordArray): string {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const map = this._map;

    wordArray.clamp();

    const base64Chars: string[] = [];
    for (let i = 0; i < sigBytes; i += 3) {
      const byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      const byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
      const byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

      const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

      for (let j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
        base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
      }
    }

    const paddingChar = map.charAt(64);
    if (paddingChar) {
      while (base64Chars.length % 4) {
        base64Chars.push(paddingChar);
      }
    }

    return base64Chars.join('');
  },

  parse(base64Str: string): WordArray {
    let base64StrLength = base64Str.length;
    const map = this._map;

    // 缓存逆向映射表
    if (!this._reverseMap) {
      this._reverseMap = [];
      for (let j = 0; j < map.length; j++) {
        this._reverseMap[map.charCodeAt(j)] = j;
      }
    }
    const reverseMap = this._reverseMap;

    // 处理 Padding
    const paddingChar = map.charAt(64);
    if (paddingChar) {
      const paddingIndex = base64Str.indexOf(paddingChar);
      if (paddingIndex !== -1) {
        base64StrLength = paddingIndex;
      }
    }

    // 解析循环
    const words: number[] = [];
    let nBytes = 0;
    for (let i = 0; i < base64StrLength; i++) {
      if (i % 4) {
        const bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
        const bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
        words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
        nBytes++;
      }
    }

    return WordArray.create(words, nBytes);
  }
};

// ==========================================
// 3. Padding (PKCS7 - from cipher-core.js)
// ==========================================

export const Pkcs7 = {
  pad(data: WordArray, blockSize: number) {
    const blockSizeBytes = blockSize * 4;
    // 计算需要填充的字节数 (1到16字节)
    const nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);
    // 构造填充值 (例如需要填4个字节，就是 04 04 04 04)
    const paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

    const paddingWords = [];
    for (let i = 0; i < nPaddingBytes; i += 4) {
      paddingWords.push(paddingWord);
    }
    const padding = WordArray.create(paddingWords, nPaddingBytes);
    data.concat(padding);
  },
  unpad(data: WordArray) {
    // 读取最后一个字节的值作为填充长度
    const nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
    // 移除填充
    if (nPaddingBytes > 0 && nPaddingBytes <= 16) {
      data.sigBytes -= nPaddingBytes;
    }
  }
};

// ==========================================
// 4. Algorithm (AES Engine - from aes.js)
// ==========================================

// 预计算的查表
const SBOX: number[] = [];
const INV_SBOX: number[] = [];
const SUB_MIX_0: number[] = [];
const SUB_MIX_1: number[] = [];
const SUB_MIX_2: number[] = [];
const SUB_MIX_3: number[] = [];
const INV_SUB_MIX_0: number[] = [];
const INV_SUB_MIX_1: number[] = [];
const INV_SUB_MIX_2: number[] = [];
const INV_SUB_MIX_3: number[] = [];
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// 立即执行函数初始化查表
(function computeTables() {
  const d: number[] = [];
  for (let i = 0; i < 256; i++) {
    d[i] = i < 128 ? i << 1 : (i << 1) ^ 0x11b;
  }

  let x = 0;
  let xi = 0;
  for (let i = 0; i < 256; i++) {
    let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
    SBOX[x] = sx;
    INV_SBOX[sx] = x;

    const x2 = d[x];
    const x4 = d[x2];
    const x8 = d[x4];

    let t = (d[sx] * 0x101) ^ (sx * 0x1010100);
    SUB_MIX_0[x] = (t << 24) | (t >>> 8);
    SUB_MIX_1[x] = (t << 16) | (t >>> 16);
    SUB_MIX_2[x] = (t << 8) | (t >>> 24);
    SUB_MIX_3[x] = t;

    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
    INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
    INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
    INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
    INV_SUB_MIX_3[sx] = t;

    if (!x) {
      x = xi = 1;
    } else {
      x = x2 ^ d[d[d[x8 ^ x2]]];
      xi ^= d[d[xi]];
    }
  }
})();

// AES 核心算法类
class AESAlgo {
  _key: WordArray;
  _keySchedule: number[] = [];
  _invKeySchedule: number[] = [];
  _nRounds: number = 0;
  blockSize: number = 128 / 32;

  constructor(key: WordArray) {
    this._key = key;
    this.doReset();
  }

  doReset() {
    let t;
    const keyWords = this._key.words;
    const keySize = this._key.sigBytes / 4;

    this._nRounds = keySize + 6;
    const ksRows = (this._nRounds + 1) * 4;

    // 密钥扩展 (Key Schedule)
    for (let ksRow = 0; ksRow < ksRows; ksRow++) {
      if (ksRow < keySize) {
        this._keySchedule[ksRow] = keyWords[ksRow];
      } else {
        t = this._keySchedule[ksRow - 1];
        if (!(ksRow % keySize)) {
          t = (t << 8) | (t >>> 24);
          t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
          t ^= RCON[(ksRow / keySize) | 0] << 24;
        } else if (keySize > 6 && ksRow % keySize == 4) {
          t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
        }
        this._keySchedule[ksRow] = this._keySchedule[ksRow - keySize] ^ t;
      }
    }

    // 逆向密钥扩展 (Inv Key Schedule)
    for (let invKsRow = 0; invKsRow < ksRows; invKsRow++) {
      const ksRow = ksRows - invKsRow;
      const t = invKsRow % 4 ? this._keySchedule[ksRow] : this._keySchedule[ksRow - 4];

      if (invKsRow < 4 || ksRow <= 4) {
        this._invKeySchedule[invKsRow] = t;
      } else {
        this._invKeySchedule[invKsRow] =
          INV_SUB_MIX_0[SBOX[t >>> 24]] ^
          INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
          INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^
          INV_SUB_MIX_3[SBOX[t & 0xff]];
      }
    }
  }

  encryptBlock(M: number[], offset: number) {
    this.doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
  }

  decryptBlock(M: number[], offset: number) {
    // Swap for decryption optimization (as per source)
    let t = M[offset + 1];
    M[offset + 1] = M[offset + 3];
    M[offset + 3] = t;

    this.doCryptBlock(
      M,
      offset,
      this._invKeySchedule,
      INV_SUB_MIX_0,
      INV_SUB_MIX_1,
      INV_SUB_MIX_2,
      INV_SUB_MIX_3,
      INV_SBOX
    );

    t = M[offset + 1];
    M[offset + 1] = M[offset + 3];
    M[offset + 3] = t;
  }

  doCryptBlock(
    M: number[],
    offset: number,
    keySchedule: number[],
    SUB_MIX_0: number[],
    SUB_MIX_1: number[],
    SUB_MIX_2: number[],
    SUB_MIX_3: number[],
    SBOX: number[]
  ) {
    const nRounds = this._nRounds;
    let s0 = M[offset] ^ keySchedule[0];
    let s1 = M[offset + 1] ^ keySchedule[1];
    let s2 = M[offset + 2] ^ keySchedule[2];
    let s3 = M[offset + 3] ^ keySchedule[3];
    let ksRow = 4;

    for (let round = 1; round < nRounds; round++) {
      const t0 =
        SUB_MIX_0[s0 >>> 24] ^
        SUB_MIX_1[(s1 >>> 16) & 0xff] ^
        SUB_MIX_2[(s2 >>> 8) & 0xff] ^
        SUB_MIX_3[s3 & 0xff] ^
        keySchedule[ksRow++];
      const t1 =
        SUB_MIX_0[s1 >>> 24] ^
        SUB_MIX_1[(s2 >>> 16) & 0xff] ^
        SUB_MIX_2[(s3 >>> 8) & 0xff] ^
        SUB_MIX_3[s0 & 0xff] ^
        keySchedule[ksRow++];
      const t2 =
        SUB_MIX_0[s2 >>> 24] ^
        SUB_MIX_1[(s3 >>> 16) & 0xff] ^
        SUB_MIX_2[(s0 >>> 8) & 0xff] ^
        SUB_MIX_3[s1 & 0xff] ^
        keySchedule[ksRow++];
      const t3 =
        SUB_MIX_0[s3 >>> 24] ^
        SUB_MIX_1[(s0 >>> 16) & 0xff] ^
        SUB_MIX_2[(s1 >>> 8) & 0xff] ^
        SUB_MIX_3[s2 & 0xff] ^
        keySchedule[ksRow++];
      s0 = t0;
      s1 = t1;
      s2 = t2;
      s3 = t3;
    }

    const t0 =
      ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^
      keySchedule[ksRow++];
    const t1 =
      ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^
      keySchedule[ksRow++];
    const t2 =
      ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^
      keySchedule[ksRow++];
    const t3 =
      ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^
      keySchedule[ksRow++];

    M[offset] = t0;
    M[offset + 1] = t1;
    M[offset + 2] = t2;
    M[offset + 3] = t3;
  }
}

// ==========================================
// 5. Mode (CBC - from cipher-core.js)
// ==========================================

// CBC 模式基类
abstract class BlockCipherMode {
  _cipher: AESAlgo;
  _iv: number[] | undefined;

  constructor(cipher: AESAlgo, iv?: number[]) {
    this._cipher = cipher;
    this._iv = iv;
  }

  abstract processBlock(words: number[], offset: number): void;
}

// CBC 加密器
class CBCEncryptor extends BlockCipherMode {
  _prevBlock: number[] | undefined;

  processBlock(words: number[], offset: number) {
    const cipher = this._cipher;
    const blockSize = cipher.blockSize;

    // XOR 前一个块 (或IV) 与 当前块，然后加密
    this.xorBlock(words, offset, blockSize);
    cipher.encryptBlock(words, offset);

    // 保存当前密文块用于下一轮 XOR
    this._prevBlock = words.slice(offset, offset + blockSize);
  }

  xorBlock(words: number[], offset: number, blockSize: number) {
    let block;
    if (this._iv) {
      block = this._iv;
      this._iv = undefined; // IV 只用一次
    } else {
      block = this._prevBlock;
    }
    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= block![i];
    }
  }
}

// CBC 解密器
class CBCDecryptor extends BlockCipherMode {
  _prevBlock: number[] | undefined;

  processBlock(words: number[], offset: number) {
    const cipher = this._cipher;
    const blockSize = cipher.blockSize;
    // 先保存密文用于下一轮 XOR
    const thisBlock = words.slice(offset, offset + blockSize);

    // 解密，然后 XOR
    cipher.decryptBlock(words, offset);
    this.xorBlock(words, offset, blockSize);

    this._prevBlock = thisBlock;
  }

  xorBlock(words: number[], offset: number, blockSize: number) {
    let block;
    if (this._iv) {
      block = this._iv;
      this._iv = undefined;
    } else {
      block = this._prevBlock;
    }
    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= block![i];
    }
  }
}

// ==========================================
// 6. High Level API (Main Export)
// ==========================================

export class AES {
  /**
   * 加密 (CBC Mode, PKCS7 Padding)
   * @param message 明文 (字符串 或 WordArray)
   * @param key 密钥 (Hex字符串, WordArray 或 Utf8字符串)
   * @param cfg 配置对象 { iv: WordArray }
   * @returns Base64 字符串
   */
  static encrypt(message: string | WordArray, key: string | WordArray, cfg: { iv: WordArray }): string {
    // 参数处理
    const keyWA = typeof key === 'string' ? Utf8.parse(key) : key;
    const dataWA = typeof message === 'string' ? Utf8.parse(message) : message.clone();

    // 1. 初始化 AES 引擎
    const aes = new AESAlgo(keyWA);

    // 2. 初始化 CBC 加密器
    const mode = new CBCEncryptor(aes, cfg.iv.words.slice(0));

    // 3. 填充 (Padding)
    Pkcs7.pad(dataWA, aes.blockSize);

    // 4. 分组加密
    const blockSize = aes.blockSize;
    const words = dataWA.words;
    const sigBytes = dataWA.sigBytes;

    for (let offset = 0; offset < sigBytes / 4; offset += blockSize) {
      mode.processBlock(words, offset);
    }

    // 5. 输出 Base64
    return Base64.stringify(dataWA);
  }

  /**
   * 解密 (CBC Mode, PKCS7 Padding)
   * @param ciphertext 密文 (Base64 字符串)
   * @param key 密钥
   * @param cfg 配置对象 { iv: WordArray }
   * @returns Utf8 字符串
   */
  static decrypt(ciphertext: string, key: string | WordArray, cfg: { iv: WordArray }): string {
    const keyWA = typeof key === 'string' ? Utf8.parse(key) : key;

    // 1. 解析 Base64 输入
    const dataWA = Base64.parse(ciphertext);

    // 2. 初始化 AES 引擎
    const aes = new AESAlgo(keyWA);

    // 3. 初始化 CBC 解密器
    const mode = new CBCDecryptor(aes, cfg.iv.words.slice(0));

    // 4. 分组解密
    const blockSize = aes.blockSize;
    const words = dataWA.words;
    const sigBytes = dataWA.sigBytes;

    for (let offset = 0; offset < sigBytes / 4; offset += blockSize) {
      mode.processBlock(words, offset);
    }

    // 5. 去除填充 (Unpad)
    Pkcs7.unpad(dataWA);

    // 6. 转为 Utf8 字符串
    return Utf8.stringify(dataWA);
  }
}
