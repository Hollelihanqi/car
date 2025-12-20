import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCredentialStore } from './credential';
import { verifyVC } from '@/api/credential';

export interface VerifyItem {
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error' | 'stopped' | 'api-error';
  expectedResult: string;
  errorMessage?: string;
}

export const useVerificationStore = defineStore(
  'verification',
  () => {
    // ==================== State ====================
    const verifyItems = ref<VerifyItem[]>([
      { label: '验证凭证有效期', status: 'loading', expectedResult: 'VCStatusNormal' },
      { label: '验证凭证签名', status: 'loading', expectedResult: 'ValidSign' },
      { label: '验证签发者身份', status: 'loading', expectedResult: 'RegisteredIssuer' },
      { label: '验证所有者身份', status: 'loading', expectedResult: 'VCIdNotFound' },
      { label: '验证凭证吊销状态', status: 'loading', expectedResult: 'VCStatusNormal' }
    ]);

    const verifyError = ref<string>('');
    const allVerified = ref(false);
    const verifySerialNumber = ref('');
    const verifyTime = ref('');
    const isVerifying = ref(false);
    const isApiError = ref(false); // 标识是否为 API 调用错误

    // ==================== Getters ====================
    const isVerificationComplete = computed(() => {
      return allVerified.value || (verifyError.value !== '' && !allVerified.value);
    });

    // ==================== Actions ====================

    /** 生成验证流水号 */
    const generateSerialNumber = (): string => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      return `VF${timestamp}${random}`;
    };

    /** 获取当前时间 ISO 格式 */
    const getCurrentTime = (): string => {
      return new Date().toISOString();
    };

    /** 验证凭证有效期（本地验证） */
    const verifyCredentialValidity = (): { status: 'success' | 'error'; message: string } => {
      const credentialStore = useCredentialStore();
      const credential = credentialStore.credentialInfo;

      if (!credential) {
        return { status: 'error', message: '凭证信息不存在' };
      }

      // 从凭证信息中提取"凭证有效期"字段
      let validityDateStr: string | undefined = undefined;

      // 先尝试从 credentialSubject 中获取
      if (credential.credentialSubject && typeof credential.credentialSubject === 'object') {
        validityDateStr = credential.credentialSubject['凭证有效期'] || credential.credentialSubject['凭证有效期限'];
      }

      // 如果 credentialSubject 中没有，尝试从根级别获取
      if (!validityDateStr && credential['凭证有效期']) {
        validityDateStr = credential['凭证有效期'];
      }

      if (!validityDateStr) {
        return { status: 'error', message: '凭证有效期信息不存在' };
      }

      // 解析日期时间（格式："2025.12.12 15:54"）
      try {
        const parts = validityDateStr.trim().split(' ');
        if (parts.length !== 2) {
          return { status: 'error', message: '凭证有效期格式错误' };
        }

        const datePart = parts[0]; // "2025.12.12"
        const timePart = parts[1]; // "15:54"

        // 将日期部分转换为标准格式：YYYY-MM-DD
        const dateStr = datePart.replace(/\./g, '-');
        // 组合成完整的日期时间字符串：YYYY-MM-DD HH:mm
        const dateTimeStr = `${dateStr} ${timePart}`;

        // 解析为 Date 对象
        const validityDate = new Date(dateTimeStr);

        // 检查日期是否有效
        if (isNaN(validityDate.getTime())) {
          return { status: 'error', message: '凭证有效期格式错误' };
        }

        // 获取当前时间
        const currentDate = new Date();

        // 比对：凭证有效期大于当前时间则有效，否则失败
        if (validityDate > currentDate) {
          return { status: 'success', message: '' };
        } else {
          return { status: 'error', message: '凭证已过期' };
        }
      } catch (error) {
        console.error('解析凭证有效期失败:', error);
        return { status: 'error', message: '解析凭证有效期失败' };
      }
    };

    /** 根据验证结果计算每个验证项应该的状态 */
    const calculateVerifyItemsStatus = (result: string): Array<{ status: 'success' | 'error'; message: string }> => {
      const statusMap: Record<string, { index: number; success: boolean; message: string }> = {
        RegisteredIssuer: { index: 0, success: true, message: '' },
        UnregisteredIssuer: { index: 0, success: false, message: '签发者未注册' },
        VCIdNotFound: { index: 1, success: false, message: 'VC ID不存在' },
        ValidSign: { index: 2, success: true, message: '' },
        InvalidSign: { index: 2, success: false, message: '签名验证不通过' },
        VCStatusNormal: { index: 3, success: true, message: '' },
        Revoked: { index: 4, success: false, message: '凭证已吊销' },
        HashMatched: { index: 4, success: true, message: '' },
        HashNotMatch: { index: 4, success: false, message: '哈希不匹配' }
      };

      const status = statusMap[result];
      if (!status) {
        console.warn('未知的验证结果:', result);
        verifyError.value = '未知的验证结果';
        return Array(5).fill({ status: 'error' as const, message: '未知的验证结果' });
      }

      const itemsStatus: Array<{ status: 'success' | 'error'; message: string }> = [];

      // 如果所有验证都通过，返回 HashMatched，所有项都成功
      if (result === 'HashMatched') {
        for (let i = 0; i < 5; i++) {
          itemsStatus.push({ status: 'success', message: '' });
        }
        return itemsStatus;
      }

      // 特殊处理：如果返回 VCStatusNormal，说明验证有效期和吊销状态都正常
      if (result === 'VCStatusNormal') {
        for (let i = 0; i < 4; i++) {
          itemsStatus.push({ status: 'success', message: '' });
        }
        itemsStatus.push({ status: 'success', message: '' });
        return itemsStatus;
      }

      // 根据结果计算每个验证项的状态
      if (status.success) {
        for (let i = 0; i <= status.index; i++) {
          itemsStatus.push({ status: 'success', message: '' });
        }
        for (let i = status.index + 1; i < 5; i++) {
          itemsStatus.push({ status: 'success', message: '' });
        }
      } else {
        for (let i = 0; i < status.index; i++) {
          itemsStatus.push({ status: 'success', message: '' });
        }
        itemsStatus.push({ status: 'error', message: status.message });
        for (let i = status.index + 1; i < 5; i++) {
          itemsStatus.push({ status: 'success', message: '' });
        }
        verifyError.value = status.message;
      }

      return itemsStatus;
    };

    /** 一次性更新所有验证项状态 */
    const updateAllVerifyItemsStatus = (result: string) => {
      const itemsStatus = calculateVerifyItemsStatus(result);
      // 当返回 HashMatched 或 VCStatusNormal 时，认为验证成功
      const allSuccess =
        itemsStatus.every((item) => item.status === 'success') &&
        (result === 'HashMatched' || result === 'VCStatusNormal');
      const firstErrorIndex = itemsStatus.findIndex((item) => item.status === 'error');

      // itemsStatus 的索引映射（基于旧的验证顺序：签发者->所有者->签名->有效期->吊销状态）
      // itemsStatus[0] = 签发者 -> verifyItems[2]
      // itemsStatus[1] = 所有者 -> verifyItems[3]
      // itemsStatus[2] = 签名 -> verifyItems[1]
      // itemsStatus[3] = 有效期 -> verifyItems[0] (已提前验证)
      // itemsStatus[4] = 吊销状态 -> verifyItems[4]
      const statusToVerifyItemMap = [2, 3, 1, 0, 4]; // itemsStatus索引 -> verifyItems索引

      // 一次性更新所有验证项状态（从索引1开始，因为索引0是有效期验证）
      for (let i = 1; i < verifyItems.value.length; i++) {
        // 找到 itemsStatus 中对应的索引
        const statusIndex = statusToVerifyItemMap.indexOf(i);

        if (statusIndex === -1 || statusIndex >= itemsStatus.length) continue;

        // 如果之前有失败项，后续项显示为停止状态
        if (firstErrorIndex !== -1 && statusIndex > firstErrorIndex) {
          verifyItems.value[i].status = 'stopped';
          continue;
        }

        verifyItems.value[i].status = itemsStatus[statusIndex].status;
        verifyItems.value[i].errorMessage = itemsStatus[statusIndex].message;

        if (itemsStatus[statusIndex].status === 'error') {
          verifyError.value = itemsStatus[statusIndex].message;
          for (let j = i + 1; j < verifyItems.value.length; j++) {
            verifyItems.value[j].status = 'stopped';
          }
          break;
        }
      }

      // 更新验证状态
      if (allSuccess) {
        allVerified.value = true;
        verifySerialNumber.value = generateSerialNumber();
        verifyTime.value = getCurrentTime();
        verifyError.value = '';
        const credentialStore = useCredentialStore();
        credentialStore.setVerificationStatus(true);
      } else {
        allVerified.value = false;
        const credentialStore = useCredentialStore();
        credentialStore.setVerificationStatus(false);
      }
    };

    /** 逐步更新验证项状态，每项之间有延迟 */
    // const updateVerifyItemsStatusGradually = async (result: string) => {
    //   const itemsStatus = calculateVerifyItemsStatus(result);
    //   // 当返回 HashMatched 或 VCStatusNormal 时，认为验证成功
    //   const allSuccess =
    //     itemsStatus.every((item) => item.status === 'success') &&
    //     (result === 'HashMatched' || result === 'VCStatusNormal');
    //   const firstErrorIndex = itemsStatus.findIndex((item) => item.status === 'error');

    //   // itemsStatus 的索引映射（基于旧的验证顺序：签发者->所有者->签名->有效期->吊销状态）
    //   // itemsStatus[0] = 签发者 -> verifyItems[2]
    //   // itemsStatus[1] = 所有者 -> verifyItems[3]
    //   // itemsStatus[2] = 签名 -> verifyItems[1]
    //   // itemsStatus[3] = 有效期 -> verifyItems[0] (已提前验证)
    //   // itemsStatus[4] = 吊销状态 -> verifyItems[4]
    //   const statusToVerifyItemMap = [2, 3, 1, 0, 4]; // itemsStatus索引 -> verifyItems索引

    //   // 逐项更新状态，每项延迟 600-800ms（从索引1开始，因为索引0是有效期验证）
    //   for (let i = 1; i < verifyItems.value.length; i++) {
    //     // 找到 itemsStatus 中对应的索引
    //     const statusIndex = statusToVerifyItemMap.indexOf(i);

    //     if (statusIndex === -1 || statusIndex >= itemsStatus.length) continue;

    //     // 如果之前有失败项，后续项显示为停止状态
    //     if (firstErrorIndex !== -1 && statusIndex > firstErrorIndex) {
    //       verifyItems.value[i].status = 'stopped';
    //       continue;
    //     }

    //     verifyItems.value[i].status = 'loading';

    //     await new Promise((resolve) => {
    //       setTimeout(resolve, 600 + Math.random() * 200);
    //     });

    //     verifyItems.value[i].status = itemsStatus[statusIndex].status;
    //     verifyItems.value[i].errorMessage = itemsStatus[statusIndex].message;

    //     if (itemsStatus[statusIndex].status === 'error') {
    //       verifyError.value = itemsStatus[statusIndex].message;
    //       for (let j = i + 1; j < verifyItems.value.length; j++) {
    //         verifyItems.value[j].status = 'stopped';
    //       }
    //       break;
    //     }
    //   }

    //   // 所有项都更新完成后，再显示顶部状态
    //   if (allSuccess) {
    //     allVerified.value = true;
    //     verifySerialNumber.value = generateSerialNumber();
    //     verifyTime.value = getCurrentTime();
    //     verifyError.value = '';
    //     const credentialStore = useCredentialStore();
    //     credentialStore.setVerificationStatus(true);
    //   } else {
    //     allVerified.value = false;
    //     const credentialStore = useCredentialStore();
    //     credentialStore.setVerificationStatus(false);
    //   }
    // };

    /** 调用后端验证接口 */
    const callVerifyAPI = async () => {
      try {
        const credentialStore = useCredentialStore();
        const credential = credentialStore.credentialInfo;
        const hash = credentialStore.credentialDigest;

        if (!credential) {
          throw new Error('凭证信息不存在');
        }

        // 从凭证中提取必要参数
        const issuerDid = credential.issuer || '';
        const vcId = credential.id || '';
        const proofValue = credential.proof?.proofValue || '';
        const verificationMethod = credential.proof?.verificationMethod || '';

        // 从 verificationMethod 中提取 keyIndex
        let keyIndex: number | undefined = undefined;
        if (verificationMethod) {
          const match = verificationMethod.match(/#keys-(\d+)/);
          if (match && match[1]) {
            const parsed = parseInt(match[1], 10);
            if (!isNaN(parsed)) {
              keyIndex = parsed;
            }
          }
        }

        // 构建请求参数
        const params = {
          issuerDid,
          proofValue,
          digest: hash,
          keyIndex,
          vcHash: credentialStore.vcHash,
          vcId
        };

        console.log('验证请求参数:', params);

        // ========== 演示模式：模拟接口调用 ==========
        // 模拟接口延迟
        // await new Promise((resolve) => setTimeout(resolve, 1500));

        // // 模拟接口返回结果（演示用）
        // const apiResult: any = {
        //   code: 0,
        //   message: '',
        //   data: {
        //     result: 'VCStatusNormal' // 可以改为 'HashMatched' 测试完全成功的情况
        //   }
        // };

        // console.log('验证返回结果（模拟）:', apiResult);

        // // 根据接口返回的 result 逐步更新其他验证项状态
        // if (apiResult.code === 0 && apiResult.data?.result) {
        //   await updateVerifyItemsStatusGradually(apiResult.data.result);
        // } else {
        //   throw new Error(apiResult.message || '验证失败');
        // }

        // ========== 真实接口调用（原代码，已注释用于演示） ==========
        // 调用验证接口
        const apiResult: any = await verifyVC(params);

        console.log('验证返回结果:', apiResult);

        // 根据接口返回的 result 一次性更新所有验证项状态
        if (apiResult.code === 0 && apiResult.data?.result) {
          updateAllVerifyItemsStatus(apiResult.data.result);
        } else {
          throw new Error(apiResult.message || '验证失败');
        }
      } catch (error: any) {
        console.error('VC 验证失败:', error);
        // 标记为 API 调用错误，不显示错误提示文字
        isApiError.value = true;
        // 如果有效期验证还没完成或失败，设置其他验证项为 API 错误状态（灰色图标）
        if (verifyItems.value[0].status === 'loading' || verifyItems.value[0].status === 'success') {
          verifyItems.value.forEach((item, index) => {
            if (index > 0 && item.status !== 'stopped') {
              item.status = 'api-error';
            }
          });
        }
        allVerified.value = false;
        verifyError.value = verifyError.value || error.message || '验证失败，请重试';
        const credentialStore = useCredentialStore();
        credentialStore.setVerificationStatus(false);
      }
    };

    /** 开始验证过程 */
    const startVerification = async () => {
      try {
        // 重置所有验证状态
        verifyItems.value.forEach((item) => {
          item.status = 'loading';
          item.errorMessage = undefined;
        });
        verifyError.value = '';
        allVerified.value = false; // 重置验证成功状态
        verifySerialNumber.value = '';
        verifyTime.value = '';
        isApiError.value = false; // 重置 API 错误标志

        // 先立即验证凭证有效期
        const validityResult = verifyCredentialValidity();
        verifyItems.value[0].status = validityResult.status;
        verifyItems.value[0].errorMessage = validityResult.message;

        // 如果有效期验证失败，设置后续项为灰色图标状态
        if (validityResult.status === 'error') {
          verifyError.value = validityResult.message;
          for (let j = 1; j < verifyItems.value.length; j++) {
            verifyItems.value[j].status = 'api-error';
          }
          allVerified.value = false;
          const credentialStore = useCredentialStore();
          credentialStore.setVerificationStatus(false);
          return;
        }

        // 有效期验证通过，继续调用接口验证其他项
        await callVerifyAPI();
      } catch (error) {
        console.error('验证过程出错:', error);
      }
    };

    /** 重置验证状态 */
    const resetVerification = () => {
      verifyItems.value = [
        { label: '验证凭证有效期', status: 'loading', expectedResult: 'VCStatusNormal' },
        { label: '验证凭证签名', status: 'loading', expectedResult: 'ValidSign' },
        { label: '验证签发者身份', status: 'loading', expectedResult: 'RegisteredIssuer' },
        { label: '验证所有者身份', status: 'loading', expectedResult: 'VCIdNotFound' },
        { label: '验证凭证吊销状态', status: 'loading', expectedResult: 'VCStatusNormal' }
      ];
      verifyError.value = '';
      allVerified.value = false;
      verifySerialNumber.value = '';
      verifyTime.value = '';
      isVerifying.value = false;
      isApiError.value = false; // 重置 API 错误标志
    };

    return {
      // State
      verifyItems,
      verifyError,
      allVerified,
      verifySerialNumber,
      verifyTime,
      isVerifying,
      isApiError,
      // Getters
      isVerificationComplete,
      // Actions
      startVerification,
      resetVerification
    };
  },
  {
    persist: {
      enabled: true
    }
  }
);
