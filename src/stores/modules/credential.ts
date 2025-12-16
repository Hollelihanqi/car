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
     * 处理凭证数据，支持两种数据模型
     * 1. 直接是凭证对象：{"credentialSchema": {...}, "credentialSubject": {...}, ...}
     * 2. 包含 data 字段：{"data": {...}, "status": 1}
     * @param raw - 原始数据（字符串或对象）
     * @returns 处理后的凭证对象，如果格式不正确返回 null
     */
    const processCredentialData = (raw: string | Record<string, any>): CredentialInfo | null => {
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

        if (!parsed || typeof parsed !== 'object') {
          return null;
        }

        // 3. 检查是否是包含 data 字段的格式
        if ('data' in parsed && parsed.data !== null && parsed.data !== undefined) {
          // 提取 data 字段
          let credentialData: any;
          if (typeof parsed.data === 'string' && parsed.data) {
            // data 是字符串类型，需要解析
            try {
              credentialData = JSON.parse(parsed.data);
            } catch (error) {
              console.error('解析 data 字段中的 JSON 失败:', error);
              return null;
            }
          } else if (typeof parsed.data === 'object') {
            // data 已经是对象类型，直接使用
            credentialData = parsed.data;
          } else {
            return null;
          }

          // 返回凭证对象
          if (credentialData && typeof credentialData === 'object') {
            return credentialData as CredentialInfo;
          }
        }

        // 4. 如果不是包含 data 字段的格式，直接返回（可能是直接的凭证对象）
        return parsed as CredentialInfo;
      } catch (error) {
        console.error('处理凭证数据出错:', error);
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
      const credential = processCredentialData(args);

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
      processCredentialData,
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
