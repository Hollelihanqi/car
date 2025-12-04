<!--
 * @Author: git.name
 * @Date: 2025-12-03 16:57:37
 * @LastEditors: git.name
 * @LastEditTime: 2025-12-04 15:27:54
 * @Description: 
-->
<template>
  <PageContainer>
    <view class="home-bg" @click="AccountApplication"></view>
    <!-- <Test v-if="showTestTools" :parse-credential-args="parseCredentialArgs" :storage-key="CREDENTIAL_STORAGE_KEY" /> -->
  </PageContainer>
  <up-modal
    :show="showModal"
    confirmText="確認"
    cancelText="取消"
    :showCancelButton="true"
    confirmColor="#db0011"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <view class="flex! flex-col gap-2 flex-wrap items-center justify-center">
      <text>請到</text>
      <text class="mx-1 text-[#db0011] font-semibold">中移可信憑證</text>
      <text>微信小程序申請手機號憑證。</text>
    </view>
  </up-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PageContainer from '@/components/PageContainer.vue';
// import Test from './Test.vue';

const showModal = ref(false);
const weChatParams = ref('');
const awaitingCredential = ref(false);
const CREDENTIAL_STORAGE_KEY = 'credentialInfo';
const appName = '汇丰银行';
const templateId = 'c41b7c0ca0e64810bdbdca152992e2a0';
const miniAppId = 'gh_cc48f41a4594';

const AccountApplication = () => {
  console.log('AccountApplication clicked');
  showModal.value = true;
};

const launchMiniProgram = () => {
  // #ifdef APP-PLUS
  plus.share.getServices(
    (services) => {
      const weixinService = services.find((item: any) => item.id === 'weixin');
      console.log('weixinService:', weixinService);
      if (!weixinService) {
        awaitingCredential.value = false;
        uni.showToast({ title: '未檢測到微信服務', icon: 'none' });
        return;
      }
      awaitingCredential.value = true;
      weChatParams.value = '';
      weixinService.launchMiniProgram({
        id: miniAppId,
        path: `/pages/authn/mobile-demo?appName=${appName}&templateId=${templateId}`,
        type: 2
      });
    },
    (err) => {
      console.log('getServices err:', err);
      awaitingCredential.value = false;
      uni.showToast({ title: '獲取微信服務失敗', icon: 'none' });
    }
  );
  // #endif
};

const onConfirm = () => {
  showModal.value = false;
  // #ifdef H5
  uni.showToast({
    title: '請在客戶端打開以跳轉小程序',
    icon: 'none'
  });
  // #endif
  // #ifndef H5
  launchMiniProgram();
  // #endif
};

const onCancel = () => {
  showModal.value = false;
};

onShow(() => {
  // #ifdef APP-PLUS
  const args = plus.runtime.arguments;
  if (!args) {
    awaitingCredential.value = false;
    return;
  }
  if (!awaitingCredential.value && args === weChatParams.value) {
    return;
  }
  awaitingCredential.value = false;
  weChatParams.value = args;
  const credential = parseCredentialArgs(args);
  if (credential) {
    uni.setStorageSync(CREDENTIAL_STORAGE_KEY, credential);
    uni.navigateTo({ url: '/pages/home/CredentialInfo' });
  }
  // #endif
});

const parseCredentialArgs = (raw: string) => {
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

const parseQuery = (query: string) => {
  return query.split('&').reduce(
    (acc, pair) => {
      if (!pair) {
        return acc;
      }
      const [key, ...rest] = pair.split('=');
      if (!key) {
        return acc;
      }
      const decodedKey = safeDecodeURIComponent(key);
      const decodedValue = safeDecodeURIComponent(rest.join('='));
      acc[decodedKey] = decodedValue;
      return acc;
    },
    {} as Record<string, string>
  );
};

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    console.log('decodeURIComponent error', error, value);
    return value;
  }
};
</script>

<style lang="scss" scoped>
.home-bg {
  width: 100%;
  height: 100%;
  background: url('/static/home_feature.png');
  background-size: 100% 100%;
}
</style>
