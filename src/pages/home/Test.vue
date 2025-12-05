<template>
  <view class="test-btn-wrapper">
    <up-button type="primary" @click.stop="handleTestCredential">測試憑證</up-button>
  </view>
</template>

<script setup lang="ts">
import { useCredentialStore } from '@/stores';

const credentialStore = useCredentialStore();

/** 测试数据（最新数据结构） */
const TEST_CREDENTIAL_ARGS = `ifAllow=true&Credential={"@context":["https://www.w3.org/ns/credentials/v2","http://52.83.105.190:11200/base_context.json"],"credentialSchema":{"id":"http://52.83.105.190:11200/credentialSchema/c41b7c0ca0e64810bdbdca152992e2a0.json","type":"JsonSchema"},"credentialSubject":{"id":"did:ctid:bsn:41F7641F40AB684E88236677676A2CE46B13B8377628344BB2B2E621159D8648","verificationMethod":"did:ctid:bsn:41F7641F40AB684E88236677676A2CE46B13B8377628344BB2B2E621159D8648#keys-115","姓名":"张三","手机号":"13429089080","在网时长":"大于5个月","移动验证流水号":"TEST20240520150000001234567890ABCDEF7890","移动验证时间戳":"1780000000456"},"id":"gbu683mm9tarbhh6mchrxa18h2ds5wp4","issuer":"did:gxdid:7ed22fdfbef74e54896a374d4e800a0d","proof":{"created":"2025-12-05T06:43:41Z","proofPurpose":"assertionMethod","proofValue":"304502210080259f16d03cdbdc31f54fa1c53ad14cc36224f6b8d1794cad6814294ab0ce2802203a2299723086c907e4a119a5894bb9684fad153c8c72a6e4bca566a5d57f514e","type":"sm2p256v1","verificationMethod":"did:gxdid:7ed22fdfbef74e54896a374d4e800a0d#key-1"},"type":["VerifiableCredential"],"validFrom":"2025-12-04T11:00:00Z","validUntil":"2029-05-19T11:30:00Z"}`;

const handleTestCredential = async () => {
  const success = await credentialStore.handleCredentialArgs(TEST_CREDENTIAL_ARGS);
  if (success) {
    uni.navigateTo({ url: '/pages/home/CredentialInfo' });
  } else {
    uni.showToast({ title: '測試憑證解析失敗', icon: 'none' });
  }
};
</script>

<style scoped lang="scss">
.test-btn-wrapper {
  position: absolute;
  bottom: 40rpx;
  left: 0;
  right: 0;
  padding: 0 40rpx;
}
</style>
