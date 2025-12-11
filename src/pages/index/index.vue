<template>
  <PageContainer>
    <view class="w-full h-full flex items-center justify-center bg-white">
      <image class="logo w-30 h-30" src="/static/logo.svg" mode="aspectFit" />
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';

onMounted(() => {
  // 2秒后跳转到首页
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/home/Index'
    });
  }, 2000);
});
</script>

<style lang="scss" scoped>
.logo {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
