<template>
  <view class="test-btn-wrapper">
    <up-button type="primary" @click.stop="handleTestCredential">測試憑證</up-button>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  parseCredentialArgs: (raw: string) => Record<string, any> | null;
  storageKey: string;
}>();

const TEST_CREDENTIAL_ARGS =
  'ifAllow=true&Credential={"@context":["https://www.w3.org/ns/credentials/v2","http://vc.bsnbase.com/base_context.json","http://vc.bsnbase.com/test.json"],"credentialSchema":{"id":"http://vc.bsnbase.com/credentialSchema/2vg11b4me1owb2zpffu9rmm8xi8iyj6u.json","type":"JsonSchema"},"credentialSubject":{"id":"did:ctid:bsn:41F7641F40AB684E88236677676A2CE46B13B8377628344BB2B2E621159D8648","verificationMethod":"did:ctid:bsn:41F7641F40AB684E88236677676A2CE46B13B8377628344BB2B2E621159D8648#keys-113","姓名":"张三"},"id":"f05rg8xwzmjmdquonym2r6uzh1clfk0r","issuer":"did:gxdid:8099a7d1c68e4e869b61b5f52021f5c7","proof":{"created":"2025-11-11T05:42:33Z","proofPurpose":"assertionMethod","proofValue":"3046022100d2b15126b1846f3db50ec4fdb83a83a4e02169e82d2cc8d0003d32db6de41e75022100d2ec8187e728622e0f2c8ccae57f97974c4682fa43fba34e8f9b4bdc43316443","type":"sm2p256v1","verificationMethod":"did:gxdid:8099a7d1c68e4e869b61b5f52021f5c7#key-1"},"type":["VerifiableCredential"],"validFrom":"2025-09-16T03:28:29Z","validUntil":"2026-03-16T03:28:29Z"}';

const handleTestCredential = () => {
  if (!props.parseCredentialArgs) {
    uni.showToast({ title: '缺少解析方法', icon: 'none' });
    return;
  }
  const credential = props.parseCredentialArgs(TEST_CREDENTIAL_ARGS);
  if (credential) {
    uni.setStorageSync(props.storageKey, credential);
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
