<!--
 * @Description: 中国移动授权加载页面
-->
<template>
  <view class="loading-container">
    <view class="loading-content">
      <!-- 授权中状态 -->
      <view v-if="status === 'loading'" class="status-box">
        <van-loading size="48px" color="#db0011" vertical>正在授权中...</van-loading>
      </view>

      <!-- 授权成功状态 -->
      <view v-else-if="status === 'success'" class="status-box">
        <van-icon name="checked" size="64px" color="#07c160" />
        <text class="status-title success">授权成功</text>
      </view>

      <!-- 授权失败状态 -->
      <view v-else-if="status === 'failed'" class="status-box">
        <van-icon name="close" size="64px" color="#ee0a24" />
        <text class="status-title failed">授权失败</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

type AuthStatus = 'loading' | 'success' | 'failed';

const status = ref<AuthStatus>('loading');

// 模拟调用中国移动小程序授权
const callChinaMobileAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟授权过程，2秒后返回结果
    setTimeout(() => {
      // 模拟 80% 成功率
      const isSuccess = Math.random() > 0.2;
      resolve(isSuccess);
    }, 2000);
  });
};

// 执行授权
const doAuth = async () => {
  status.value = 'loading';

  try {
    const result = await callChinaMobileAuth();

    if (result) {
      status.value = 'success';

      // 1.5秒后跳转到VC上传页面
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/auth/vc-upload'
        });
      }, 1500);
    } else {
      status.value = 'failed';

      // 1.5秒后返回授权登录页面
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/auth/auth-login'
        });
      }, 1500);
    }
  } catch (error) {
    status.value = 'failed';
    console.error('授权失败:', error);

    // 1.5秒后返回授权登录页面
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/auth/auth-login'
      });
    }, 1500);
  }
};

onMounted(() => {
  doAuth();
});
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 24px;
  box-sizing: border-box;
}

.loading-content {
  width: 100%;
  max-width: 320px;
}

.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.status-title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  margin-top: 16px;

  &.success {
    color: #07c160;
  }

  &.failed {
    color: #ee0a24;
  }
}
</style>
