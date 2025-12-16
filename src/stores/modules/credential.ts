import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jsonStrSort } from '@/utils';
import sm3 from '@/utils/sm-crypto/sm3';
import { useVerificationStore } from './verification';
// 小程序配置常量
const MINI_APP_ID = 'gh_1a9fe4ccb8ba';
const MINI_APP_PATH = '/pages/auth/authApp';

/**
 * 小程序返回的接口响应结构
 */
export interface CredentialResponse {
  /** 凭证信息（JSON 字符串或对象），认证成功才会有值 */
  data: string | CredentialInfo;
  /** 认证状态：0 取消认证, 1 认证成功, 2 认证失败 */
  status: number;
}

export interface CredentialInfo {
  '@context'?: string[];
  credentialSchema?: {
    id: string;
    type: string;
  };
  credentialSubject?: {
    id?: string;
    verificationMethod?: string;
    姓名?: string;
    手机号?: string;
    手机号码?: string;
    在网时长?: string;
    '在网时长>=1 个月'?: string;
    凭证有效期?: string;
    验证时间?: string;
    移动验证流水号?: string;
    移动验证时间戳?: string;
    [key: string]: any;
  };
  id?: string;
  issuer?: string;
  proof?: {
    created?: string;
    proofPurpose?: string;
    proofValue?: string;
    type?: string;
    verificationMethod?: string;
  };
  type?: string[];
  validFrom?: string;
  validUntil?: string;
  [key: string]: any;
}

export const useCredentialStore = defineStore(
  'credential',
  () => {
    // ==================== State ====================
    /** 原始凭证字符串（未解析） */
    const rawCredential = ref<string>('');
    /** 解析后的凭证信息 */
    const credentialInfo = ref<CredentialInfo | null>(null);
    /** 凭证签名摘要 */
    const credentialDigest = ref<string>('');
    /** vc hash */
    const vcHash = ref<string>('');
    /** 凭证验证状态 */
    const verificationStatus = ref<boolean | null>(null);

    // ==================== Getters ====================
    /** 是否已获取凭证 */
    const hasCredential = computed(() => credentialInfo.value !== null);

    /** 凭证主体信息 */
    const credentialSubject = computed(() => credentialInfo.value?.credentialSubject || {});

    /** 是否验证成功 */
    const isVerified = computed(() => verificationStatus.value === true);

    /** 是否验证失败 */
    const isVerificationFailed = computed(() => verificationStatus.value === false);

    // ==================== Actions ====================

    /**
     * 解析凭证参数
     * 支持格式：{data: string | object, status: number}
     * - data: 凭证信息（JSON 字符串或对象），认证成功才会有值
     * - status: 0 取消认证, 1 认证成功, 2 认证失败
     */
    const parseCredentialArgs = (raw: string | Record<string, any>): CredentialInfo | null => {
      try {
        let parsed: any;

        // 1. 如果已经是对象，直接使用
        if (typeof raw === 'object' && raw !== null) {
          parsed = raw;
        }
        // 2. 如果是字符串，先解析为 JSON
        else if (typeof raw === 'string') {
          parsed = JSON.parse(raw);
        } else {
          return null;
        }

        // 3. 检查是否是新格式（包含 data 和 status 字段）
        if (parsed && typeof parsed === 'object' && 'data' in parsed && 'status' in parsed) {
          const response = parsed as CredentialResponse;

          // 检查认证状态：只有 status == 1（认证成功）时才处理
          if (response.status != 1) {
            console.warn(`认证未成功，status: ${response.status} (0=取消, 1=成功, 2=失败)`);
            return null;
          }

          // data 字段可能是字符串或对象，需要分别处理
          if (typeof response.data === 'string' && response.data) {
            // data 是字符串类型，需要解析
            try {
              const credentialData = JSON.parse(response.data);
              if (credentialData && typeof credentialData === 'object') {
                console.log('从 data 字段提取凭证数据（认证成功，字符串格式）');
                return credentialData as CredentialInfo;
              }
            } catch (parseError) {
              console.error('解析 data 字段中的 JSON 失败:', parseError);
              return null;
            }
          } else if (typeof response.data === 'object' && response.data !== null) {
            // data 已经是对象类型，直接使用
            console.log('从 data 字段提取凭证数据（认证成功，对象格式）');
            return response.data as CredentialInfo;
          } else {
            console.warn('data 字段为空或格式不正确');
            return null;
          }
        }

        // 如果不是新格式，返回 null
        console.warn('凭证格式不正确：缺少 data 或 status 字段');
        return null;
      } catch (error) {
        console.error('parse credential args error', error);
        return null;
      }
    };

    const computeHash = (): string => {
      if (!credentialInfo.value) return '';
      try {
        const credential = JSON.parse(JSON.stringify(credentialInfo.value));
        Reflect.deleteProperty(credential || {}, 'proof'); // 排除 proof 字段
        const sortedStr = jsonStrSort(JSON.stringify(credential));
        if (!sortedStr) {
          console.error('JSON 排序失败');
          return '';
        }
        console.log('sortedStr', sortedStr);
        const hash = sm3(sortedStr).toUpperCase();
        console.log('SM3 Hash computed:', hash);
        return hash;
      } catch (error) {
        console.error('计算 SM3 Hash 失败', error);
        return '';
      }
    };

    const computeVcHash = (): string => {
      if (!credentialInfo.value) return '';
      try {
        const credential = JSON.parse(JSON.stringify(credentialInfo.value));
        const sortedStr: any = jsonStrSort(JSON.stringify(credential));
        if (!sortedStr) {
          console.error('JSON 排序失败');
          return '';
        }
        console.log('vcHash sortedStr', sortedStr);
        const hash = sm3(sortedStr).toUpperCase();
        console.log('VC Hash computed:', hash);
        return hash;
      } catch (error) {
        console.error('计算 VC Hash 失败', error);
        return '';
      }
    };

    /** 保存凭证信息 */
    const saveCredential = async (credential: CredentialInfo) => {
      credentialInfo.value = credential;

      // 对凭证内容进行 hash
      try {
        const credentialStr = JSON.stringify(credential);
        rawCredential.value = credentialStr;
        credentialDigest.value = computeHash();
        vcHash.value = computeVcHash();
        console.log('Credential Digest:', credentialDigest.value);
        console.log('VC Hash:', vcHash.value);
      } catch (error) {
        console.error('计算 Credential Hash 失败', error);
      }
    };

    /**
     * 安全跳转到验证页面
     * 检查页面栈和验证状态，避免页面销毁后的错误
     */
    const navigateToVerifyPage = (): void => {
      try {
        // 检查页面栈是否存在，避免在页面销毁后执行跳转
        const pages = getCurrentPages();
        if (pages.length === 0) {
          console.warn('页面栈为空，取消跳转');
          return;
        }

        // 判断：未验证且存在凭证信息
        if (!isVerified.value && credentialInfo.value) {
          uni.redirectTo({
            url: '/pages/home/CredentialVerify',
            fail: (err) => {
              console.warn('页面跳转失败:', err);
            }
          });
        }
      } catch (error) {
        console.warn('页面跳转时发生错误:', error);
      }
    };

    /**
     * 处理凭证的核心逻辑（公共部分）
     * @param args 凭证参数（字符串或对象）
     * @param logPrefix 日志前缀，用于区分不同来源
     * @returns 凭证信息，如果解析失败返回 null
     */
    const processCredentialCore = async (
      args: string | Record<string, any>,
      logPrefix: string = '凭证'
    ): Promise<CredentialInfo | null> => {
      console.log(`开始处理${logPrefix}参数:`, args);
      const credential = parseCredentialArgs(args);

      if (!credential) {
        console.error('凭证解析结果为空');
        return null;
      }

      await saveCredential(credential);

      // 立即开始验证流程
      const verificationStore = useVerificationStore();
      verificationStore.startVerification();

      return credential;
    };

    /** 处理凭证参数，解析并保存凭证（小程序回调使用，延迟跳转） */
    const handleCredentialArgs = async (args: string): Promise<boolean> => {
      if (!args) {
        return false;
      }
      const credential = await processCredentialCore(args, '凭证');
      console.log('凭证处理完成，准备跳转验证页面', typeof args);
      if (!credential) {
        return false;
      }

      console.log('凭证处理完成，准备跳转验证页面', credential);

      // 延迟跳转到验证页面（只有未验证且有凭证信息时才跳转）
      setTimeout(() => {
        navigateToVerifyPage();
      }, 2000);

      return true;
    };

    /**
     * 处理剪切板导入的凭证参数
     * 用于剪切板点击导入后的处理，直接跳转（不使用 setTimeout）
     */
    const handleClipboardCredential = async (args: string | Record<string, any>): Promise<boolean> => {
      const credential = await processCredentialCore(args, '剪切板凭证');
      if (!credential) {
        return false;
      }

      // 直接跳转到验证页面（不使用 setTimeout）
      setTimeout(() => {
        navigateToVerifyPage();
      }, 500);

      return true;
    };

    /** 清除凭证信息 */
    const clearCredential = () => {
      rawCredential.value = '';
      credentialInfo.value = null;
      credentialDigest.value = '';
      vcHash.value = '';
      verificationStatus.value = null;
    };

    /** 设置验证状态 */
    const setVerificationStatus = (status: boolean) => {
      verificationStatus.value = status;
    };

    /**
     * 拉起微信小程序
     * @param miniAppId 小程序 ID，默认为 MINI_APP_ID
     * @param path 小程序路径，默认为 MINI_APP_PATH
     */
    const launchMiniProgram = (miniAppId = MINI_APP_ID, path = MINI_APP_PATH): Promise<boolean> => {
      // 调用前清除相关数据和重置状态
      clearCredential();

      return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        plus.share.getServices(
          (services) => {
            const weixinService = services.find((item: any) => item.id === 'weixin');
            if (!weixinService) {
              uni.showToast({ title: '未检测到微信服务', icon: 'none' });
              reject(new Error('未检测到微信服务'));
              return;
            }

            console.log('准备拉起小程序，参数：', { id: miniAppId, path, type: 2 });
            weixinService.launchMiniProgram({
              id: miniAppId,
              path,
              type: 2
            });
            resolve(true);
          },
          (err) => {
            console.log('getServices err:', err);
            uni.showToast({ title: '获取微信服务失败', icon: 'none' });
            reject(err);
          }
        );
        // #endif

        // #ifdef H5
        uni.showToast({ title: '请在客户端打开以跳转小程序', icon: 'none' });
        reject(new Error('H5 环境不支持小程序跳转'));
        // #endif
      });
    };

    return {
      // State
      rawCredential,
      credentialInfo,
      credentialDigest,
      vcHash,
      verificationStatus,
      // Getters
      hasCredential,
      credentialSubject,
      isVerified,
      isVerificationFailed,
      // Actions
      parseCredentialArgs,
      handleCredentialArgs,
      handleClipboardCredential,
      saveCredential,
      clearCredential,
      setVerificationStatus,
      launchMiniProgram
    };
  },
  {
    persist: {
      enabled: true
    }
  }
);
