<template>
  <view class="test-btn-wrapper flex flex-col">
    <span class="p-3 overflow-auto break-all">{{ hash }}</span>
    <up-button type="primary" @click.stop="handleTestCredential">测试凭证</up-button>
  </view>
</template>

<script setup lang="ts">
import { useCredentialStore } from '@/stores';
import sm3 from '@/utils/sm-crypto/sm3';
const credentialStore = useCredentialStore();

const hash = ref('');
/** 测试数据（最新数据结构） */
const TEST_CREDENTIAL_ARGS = `{"credentialSchema":{"id":"https://chinavc-dev.bsnbase.com:10201/credentialSchema/lj9h2rvkshg8ydd2ywtqry07o5ih0w58.json","type":"JsonSchema"},"credentialSubject":{"姓名":"李涵祺","手机号":"18729391167","在网时长":"24月+","实名DID":"did:ctid:bsn:B6D3F0C75B76192118CA158296ED1E6ADE2478F375F44402E4D6042A775CCD98","id":"did:ctid:bsn:B6D3F0C75B76192118CA158296ED1E6ADE2478F375F44402E4D6042A775CCD98","verificationMethod":"did:ctid:bsn:B6D3F0C75B76192118CA158296ED1E6ADE2478F375F44402E4D6042A775CCD98#keys-101"},"validUntil":"2099-12-31T15:59:59Z","id":"rbbv0ynsjpkjsapy5t4u3oywxeb7ny93","proof":{"proofValue":"3045022020c90fbde072533d27010324f786454895e7450dfb2bae9eefb9ef51ea3cac87022100e50f5e1f752f2ea4d02e350ad0ca401ca30d5c9aca2ba9bdd7844866d9c8ceae","created":"2025-12-08T10:38:59Z","proofPurpose":"assertionMethod","type":"sm2p256v1","verificationMethod":"did:gxdid:ecdbeb0caa284b4b88a8632dc64ab1fe#keys-1"},"validFrom":"2025-12-08T10:38:59Z","type":["VerifiableCredential"],"@context":["https://www.w3.org/ns/credentials/v2","https://chinavc-dev.bsnbase.com:10201/base_context.json"],"issuer":"did:gxdid:ecdbeb0caa284b4b88a8632dc64ab1fe"}`;
const TEST_CREDENTIAL =
  '{"@context":["https://www.w3.org/ns/credentials/v2","http://52.83.105.190:11200/base_context.json"],"credentialSchema":{"id":"http://52.83.105.190:11200/credentialSchema/c41b7c0ca0e64810bdbdca152992e2a0.json","type":"JsonSchema"},"credentialSubject":{"id":"did:ctid:bsn:41F7641F40AB684E88236677676A2CE46B13B8377628344BB2B2E621159D8648","verificationMethod":"did:ctid:bsn:41F7641F40AB684E88236677676A2CE46B13B8377628344BB2B2E621159D8648#keys-115","在网时长":"大于5个月","姓名":"张三","手机号":"13429089080","移动验证时间戳":"1780000000456","移动验证流水号":"TEST20240520150000001234567890ABCDEF7890"},"id":"gbu683mm9tarbhh6mchrxa18h2ds5wp4","issuer":"did:gxdid:7ed22fdfbef74e54896a374d4e800a0d","type":["VerifiableCredential"],"validFrom":"2025-12-04T11:00:00Z","validUntil":"2029-05-19T11:30:00Z"}';
const handleTestCredential = async () => {
  hash.value = sm3(TEST_CREDENTIAL).toUpperCase();
  uni.setStorageSync('TEST_CREDENTIAL_HASH', sm3(TEST_CREDENTIAL).toUpperCase());
  const success = await credentialStore.handleCredentialArgs(TEST_CREDENTIAL_ARGS);
  if (success) {
    uni.navigateTo({ url: '/pages/home/CredentialInfo' });
  } else {
    uni.showToast({ title: '测试凭证解析失败', icon: 'none' });
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
