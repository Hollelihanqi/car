<script setup lang="ts">
import { ref } from 'vue';
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCredentialStore } from '@/stores';

const credentialStore = useCredentialStore();
const weChatParams = ref('');
const awaitingCredential = ref(false);

onLaunch(() => {
  console.log('App Launch');
});

onShow(async () => {
  console.log('App Show');
  // #ifdef APP-PLUS
  const args = plus.runtime.arguments;

  // 获取当前页面路径
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentRoute = currentPage ? `/${currentPage.route}` : '';

  if (!args) {
    // 如果当前不在首页，使用 reLaunch 清空页面栈并跳转到首页
    if (currentRoute !== '/pages/home/Index') {
      uni.reLaunch({ url: '/pages/home/Index' });
    }
    awaitingCredential.value = false;
    return;
  }
  if (!awaitingCredential.value && args === weChatParams.value) {
    // 如果当前不在首页，使用 reLaunch 清空页面栈并跳转到首页
    if (currentRoute !== '/pages/home/Index') {
      uni.reLaunch({ url: '/pages/home/Index' });
    }
    return;
  }
  awaitingCredential.value = false;
  weChatParams.value = args;
  console.log('回调参数', args);
  credentialStore.handleCredentialArgs(args);
  // if (success) {
  //   uni.navigateTo({ url: '/pages/home/CredentialInfo' });
  // }
  // #endif
});

onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
