/**
 * 凭证相关 API
 */
import { post, BASE_URL_MOBILE, MOBILE_AUTHORIZATION } from '@/utils/request';

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
  /** 响应码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: {
    /** 验证结果状态 */
    result:
      | 'RegisteredIssuer'
      | 'UnregisteredIssuer'
      | 'Revoked'
      | 'VCStatusNormal'
      | 'HashNotMatch'
      | 'HashMatched'
      | 'VCIdNotFound'
      | 'ValidSign'
      | 'InvalidSign';
  };
}

/**
 * 手机号验证请求参数
 */
export interface MobileCheckRequest {
  /** 手机号（加密） */
  mobile: string;
  /** 姓名（加密） */
  name: string;
}

/**
 * 手机号验证响应结果
 */
export interface MobileCheckResponse {
  /** 响应码 */
  code: string;
  /** 在网时长 */
  onlineDuration: string;
  /** 认证状态：0-不一致，1-一致 */
  authStatus: number;
  /** 描述信息 */
  desc: string;
}

/**
 * 调用正方 VC 验证接口
 * POST http://10.0.48.22:9011/invoke/app/did/verify
 * @param params 验证参数
 * @returns 验证结果
 */
export const verifyVC = (params: VerifyVCRequest): Promise<VerifyVCResponse> => {
  return post<VerifyVCResponse>('/invoke/app/did/verify', params);
};

/**
 * 手机号验证接口
 * POST http://10.0.158.84:9005/api/v1/mobile/check
 * @param params 验证参数（手机号和姓名，需要加密）
 * @returns 验证结果
 */
export const checkMobile = (params: MobileCheckRequest): Promise<MobileCheckResponse> => {
  return post<MobileCheckResponse>('/api/v1/mobile/check', params, {
    baseURL: BASE_URL_MOBILE,
    authorization: MOBILE_AUTHORIZATION
  });
};
