import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { sm3 } from 'sm-crypto-v2';
import { jsonStrsSort } from '@/utils';
/** 凭证信息（直接结构，无 encryptedVc 包装） */
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
    /** 凭证 Hash */
    const credentialHash = ref<string>('');

    // ==================== Getters ====================
    /** 是否已获取凭证 */
    const hasCredential = computed(() => credentialInfo.value !== null);

    /** 凭证主体信息 */
    const credentialSubject = computed(() => credentialInfo.value?.credentialSubject || {});

    // ==================== Actions ====================

    /** 安全解码 URI 组件 */
    const safeDecodeURIComponent = (value: string): string => {
      try {
        return decodeURIComponent(value);
      } catch (error) {
        console.log('decodeURIComponent error', error, value);
        return value;
      }
    };

    /** 解析查询字符串 */
    const parseQuery = (query: string): Record<string, string> => {
      return query.split('&').reduce(
        (acc, pair) => {
          if (!pair) return acc;
          const [key, ...rest] = pair.split('=');
          if (!key) return acc;
          const decodedKey = safeDecodeURIComponent(key);
          const decodedValue = safeDecodeURIComponent(rest.join('='));
          acc[decodedKey] = decodedValue;
          return acc;
        },
        {} as Record<string, string>
      );
    };

    /** 解析凭证参数 */
    const parseCredentialArgs = (raw: string): CredentialInfo | null => {
      try {
        const query = raw.startsWith('?') ? raw.slice(1) : raw;
        const queryMap = parseQuery(query);
        const allow = queryMap.ifAllow;
        if (allow && allow !== 'true') {
          return null;
        }
        const credentialStr = queryMap.Credential;
        if (!credentialStr) {
          return null;
        }
        const decodedStr = safeDecodeURIComponent(credentialStr);
        const credential = JSON.parse(decodedStr || credentialStr);
        return credential;
      } catch (error) {
        console.log('parse credential args error', error);
        return null;
      }
    };

    /** 计算 encryptedVc Hash (SHA-256) 使用 crypto-js */
    const computeHash = (): string => {
      const credential = JSON.parse(JSON.stringify(credentialInfo.value));
      Reflect.deleteProperty(credential || {}, 'proof'); // 排除 proof 字段
      return sm3(jsonStrsSort(JSON.stringify(credential)));
    };

    /** 保存凭证信息 */
    const saveCredential = async (credential: CredentialInfo) => {
      credentialInfo.value = credential;

      // 对凭证内容进行 hash
      try {
        const credentialStr = JSON.stringify(credential);
        rawCredential.value = credentialStr;
        credentialHash.value = computeHash();
        console.log('Credential Hash:', credentialHash.value);
      } catch (error) {
        console.error('计算 Credential Hash 失败', error);
      }
    };

    /** 处理微信回调参数，解析并保存凭证 */
    const handleCredentialArgs = async (args: string): Promise<boolean> => {
      const credential = parseCredentialArgs(args);
      if (!credential) {
        return false;
      }
      await saveCredential(credential);
      return true;
    };

    /** 清除凭证信息 */
    const clearCredential = () => {
      rawCredential.value = '';
      credentialInfo.value = null;
      credentialHash.value = '';
    };

    return {
      // State
      rawCredential,
      credentialInfo,
      credentialHash,
      // Getters
      hasCredential,
      credentialSubject,
      // Actions
      parseCredentialArgs,
      handleCredentialArgs,
      saveCredential,
      clearCredential
    };
  },
  {
    persist: {
      enabled: true
    }
  }
);
