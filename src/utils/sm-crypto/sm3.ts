import { utf8ToArray } from './utils';

// 32-bit 左移循环
const rotl = (x: number, n: number): number => {
  return (x << n) | (x >>> (32 - n));
};

// 置换函数 P0 (用于消息扩展)
const P0 = (X: number): number => {
  return X ^ rotl(X, 9) ^ rotl(X, 17);
};

// 置换函数 P1 (用于压缩中间)
const P1 = (X: number): number => {
  return X ^ rotl(X, 15) ^ rotl(X, 23);
};

// 初始化向量 IV
const IV = new Uint32Array([
  0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e
]);

// 预分配内存以提升性能
const W = new Uint32Array(68);
const M = new Uint32Array(64);

/**
 * SM3 核心摘要计算
 * @param inputData 输入的二进制数据
 */
const sm3Digest = (inputData: Uint8Array): string => {
  // 1. 填充 (Padding)
  const len = inputData.length * 8; // 长度，单位 bit

  // k 是满足 len + 1 + k = 448 mod 512 的最小非负整数
  const k = len % 512;
  const paddingLen = k >= 448 ? 512 - (k % 448) - 1 : 448 - k - 1;

  // 总长度 = 原数据 + 1bit(0x80) + padding + 64bit(长度)
  // 转换成 byte: (1 + paddingLen / 8 + 8)
  const totalLenBytes = inputData.length + 1 + paddingLen / 8 + 8;

  const m = new Uint8Array(totalLenBytes);
  m.set(inputData, 0);

  // 填充 1 和 0 (即 0x80)
  m[inputData.length] = 0x80;

  // 填充 64位 长度 (Big Endian)
  // JS位运算只能处理32位，所以需要拆分高位和低位
  const lenHi = Math.floor(len / 0x100000000);
  const lenLo = len >>> 0; // 强制转换为无符号32位

  const view = new DataView(m.buffer);
  // 长度放在最后8个字节
  view.setUint32(totalLenBytes - 8, lenHi, false); // false = Big Endian
  view.setUint32(totalLenBytes - 4, lenLo, false);

  // 2. 迭代压缩
  const n = m.length / 64; // 分组数量
  const V = new Uint32Array(IV); // 复制初始向量

  for (let i = 0; i < n; i++) {
    const start = i * 64;

    // 消息扩展 (Message Expansion)
    // 将消息分组 B(i) 划分为 16 个字 W0...W15
    for (let j = 0; j < 16; j++) {
      W[j] = view.getUint32(start + j * 4, false);
    }

    // W16...W67
    for (let j = 16; j < 68; j++) {
      // W[j] = P1(W[j-16] ^ W[j-9] ^ (W[j-3] <<< 15)) ^ (W[j-13] <<< 7) ^ W[j-6]
      const temp = W[j - 16] ^ W[j - 9] ^ rotl(W[j - 3], 15);
      W[j] = P1(temp) ^ rotl(W[j - 13], 7) ^ W[j - 6];
    }

    // W'0...W'63
    for (let j = 0; j < 64; j++) {
      M[j] = W[j] ^ W[j + 4];
    }

    // 压缩函数 (Compression Function)
    let [A, B, C, D, E, F, G, H] = V;

    for (let j = 0; j < 64; j++) {
      const T = j < 16 ? 0x79cc4519 : 0x7a879d8a;

      // SS1 = ((A <<< 12) + E + (T <<< j)) <<< 7
      // 注意：JS加法可能溢出，需要 | 0 保持32位整数
      const SS1 = rotl((rotl(A, 12) + E + rotl(T, j)) | 0, 7);
      const SS2 = SS1 ^ rotl(A, 12);

      let TT1, TT2;

      if (j < 16) {
        // FF = A ^ B ^ C
        // GG = E ^ F ^ G
        TT1 = ((A ^ B ^ C) + D + SS2 + M[j]) | 0;
        TT2 = ((E ^ F ^ G) + H + SS1 + W[j]) | 0;
      } else {
        // FF = (A & B) | (A & C) | (B & C)
        // GG = (E & F) | (~E & G)
        TT1 = (((A & B) | (A & C) | (B & C)) + D + SS2 + M[j]) | 0;
        TT2 = (((E & F) | (~E & G)) + H + SS1 + W[j]) | 0;
      }

      D = C;
      C = rotl(B, 9);
      B = A;
      A = TT1;
      H = G;
      G = rotl(F, 19);
      F = E;
      E = P0(TT2);
    }

    // 更新 V
    V[0] ^= A;
    V[1] ^= B;
    V[2] ^= C;
    V[3] ^= D;
    V[4] ^= E;
    V[5] ^= F;
    V[6] ^= G;
    V[7] ^= H;
  }

  // 3. 输出结果
  let result = '';
  for (let i = 0; i < 8; i++) {
    // 转换为 16 进制，并补齐 8 位
    result += (V[i] >>> 0).toString(16).padStart(8, '0');
  }
  return result;
};

/**
 * SM3 计算函数
 * @param data 输入数据，支持字符串或 Uint8Array
 * @returns 64位 hex 字符串
 */
export default function sm3(data: string | Uint8Array): string {
  if (!data) return '';
  const input = typeof data === 'string' ? utf8ToArray(data) : data;
  return sm3Digest(input);
}
