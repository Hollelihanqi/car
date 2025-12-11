/**
 * 凭证相关 API
 */
import { post } from '@/utils/request';

/**
 * VC 验证请求参数（verifySignature 对象）
 */
export interface VerifySignatureParams {
  /** 摘要值 */
  digest: string;
  /** 签发者DID */
  issuerDid: string;
  /** keyIndex */
  keyIndex?: number;
  /** 证明值 */
  proofValue: string;
  /** VC哈希 */
  vcHash?: string;
  /** VC ID */
  vcId?: string;
}

/**
 * VC 验证请求体（直接使用 VerifySignatureParams）
 */
export type VerifyVCRequest = VerifySignatureParams;

/**
 * VC 验证响应结果
 */
export interface VerifyVCResponse {
  /** 验证是否成功 */
  success: boolean;
  /** 验证流水号 */
  serialNumber: string;
  /** 验证时间 */
  verifyTime: string;
  /** 错误信息（验证失败时） */
  message?: string;
}

/**
 * 调用正方 VC 验证接口
 * POST /invoke/app/did/verify
 * @param params 验证参数
 * @returns 验证结果
 */
export const verifyVC = (params: VerifyVCRequest): Promise<VerifyVCResponse> => {
  return post<VerifyVCResponse>('/invoke/app/did/verify', params);
};
