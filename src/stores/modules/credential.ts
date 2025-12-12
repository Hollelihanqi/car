import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jsonStrSort } from '@/utils';
import sm3 from '@/utils/sm-crypto/sm3';
import { useVerificationStore } from './verification';

// 小程序配置常量
const MINI_APP_ID = 'gh_1a9fe4ccb8ba';
const MINI_APP_PATH = '/pages/auth/authApp';

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
    在网时长?: string;
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
     * 简化逻辑：只处理 JSON 字符串或对象
     */
    const parseCredentialArgs = (raw: string | Record<string, any>): CredentialInfo | null => {
      try {
        // 1. 如果已经是对象，直接返回
        if (typeof raw === 'object' && raw !== null) {
          return raw as CredentialInfo;
        }

        // 2. 如果是字符串，直接按 JSON 解析
        if (typeof raw === 'string') {
          // 这里假设传入的就是纯 JSON 字符串，例如 TEST_CREDENTIAL_ARGS
          const parsed = JSON.parse(raw);
          return parsed as CredentialInfo;
        }

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
        const sortedStr = jsonStrSort(JSON.stringify(credential));
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

    /** 处理凭证参数，解析并保存凭证 */
    const handleCredentialArgs = async (args: string): Promise<boolean> => {
      console.log('开始处理凭证参数:', args); // 调试日志
      const credential = parseCredentialArgs(args);

      if (!credential) {
        console.error('凭证解析结果为空');
        return false;
      }

      await saveCredential(credential);

      // 立即开始验证流程
      const verificationStore = useVerificationStore();
      verificationStore.startVerification();

      // 2秒后跳转到验证页面（只有未验证且有凭证信息时才跳转）
      setTimeout(() => {
        // 判断：未验证且存在凭证信息
        if (!isVerified.value && credentialInfo.value) {
          uni.redirectTo({
            url: '/pages/home/CredentialVerify'
          });
        }
      }, 3000);

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
