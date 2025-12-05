import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * 用户信息状态管理 Store
 *
 * 负责管理用户的基本信息和注册相关数据，包括：
 * - 香港身份证信息（HKID）
 * - HKID 的 SHA256 哈希值（用于生成 DID）
 * - 邀请码
 * - 注册状态
 *
 * @remarks
 * - 用户信息会自动持久化到设备本地存储
 * - HKID 为敏感信息，建议脱敏显示
 * - sha256Fin 用于生成 Hong Kong DID
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // ==================== State ====================

    /** 香港身份证号（Hong Kong Identity Card） */
    const HKID = ref<string>('');

    /** HKID 的 SHA256 哈希值（用于生成 DID: did:hkdid:{sha256Fin}） */
    const sha256Fin = ref<string>('');

    /** 邀请码（注册时使用） */
    const invitationCode = ref<string>('');

    /** 是否已完成注册 */
    const isRegister = ref<boolean>(false);

    // ==================== Computed ====================

    /** 是否有完整的用户信息 */
    const hasUserInfo = computed(() => !!HKID.value && !!sha256Fin.value);

    /** 脱敏后的 HKID（显示前3位和后4位，中间用 * 替代） */
    const maskedHKID = computed(() => {
      if (!HKID.value || HKID.value.length < 7) return HKID.value;
      const firstPart = HKID.value.slice(0, 3);
      const lastPart = HKID.value.slice(-4);
      const middleLength = HKID.value.length - 7;
      return `${firstPart}${'*'.repeat(middleLength)}${lastPart}`;
    });

    // ==================== Actions ====================

    /**
     * 设置用户身份信息
     *
     * @param hkid - 香港身份证号
     * @param sha256Hash - HKID 的 SHA256 哈希值
     *
     * @remarks
     * 通常在用户通过 iAM Smart 认证后调用
     *
     * @example
     * ```typescript
     * const userStore = useUserStore();
     * userStore.setUserIdentity('A1234567', 'hash_value');
     * ```
     */
    const setUserIdentity = (hkid: string, sha256Hash: string) => {
      HKID.value = hkid;
      sha256Fin.value = sha256Hash;
    };

    /**
     * 设置邀请码
     *
     * @param code - 邀请码
     *
     * @remarks
     * 在用户输入邀请码验证通过后调用
     */
    const setInvitationCode = (code: string) => {
      invitationCode.value = code;
    };

    /**
     * 更新注册状态
     *
     * @param status - 注册状态（true: 已注册, false: 未注册）
     *
     * @remarks
     * 在用户完成 DID 注册后设置为 true
     */
    const setRegisterStatus = (status: boolean) => {
      isRegister.value = status;
    };

    /**
     * 清除用户信息
     *
     * @remarks
     * - 清空内存中的所有用户状态
     * - 本地存储会自动同步清除
     * - 通常在用户登出时调用
     */
    const clearUserInfo = () => {
      HKID.value = '';
      sha256Fin.value = '';
      invitationCode.value = '';
      isRegister.value = false;
    };

    return {
      // State
      HKID,
      sha256Fin,
      invitationCode,
      isRegister,
      // Computed
      hasUserInfo,
      maskedHKID,
      // Actions
      setUserIdentity,
      setInvitationCode,
      setRegisterStatus,
      clearUserInfo
    };
  },
  {
    persist: {
      enabled: true
    }
  }
);
