<template>
  <!-- 验证失败跳转提示 Modal -->
  <up-modal :show="showModal" :showConfirmButton="false" title="验证凭证">
    <view class="modal-content">
      <!-- 验证成功 -->
      <view v-if="allItemsComplete && allItemsSuccess" class="flex gap-[10rpx] py-[50rpx]">
        <view class="font-bold">手机号实名身份凭证</view>
        <view class="flex gap-[10rpx]">
          <text>验证成功</text>
          <up-icon name="checkmark-circle" size="20" color="green" />
        </view>
      </view>
      <!-- 验证失败 -->
      <view v-else-if="allItemsComplete && !allItemsSuccess && verifyError" class="flex gap-[10rpx] py-[50rpx]">
        <view class="font-bold">手机号实名身份凭证</view>

        <view class="flex gap-[10rpx]">
          <text>验证失败</text>
          <up-icon name="close-circle" size="20" color="red" />
        </view>
      </view>
      <!-- 正在验证 -->
      <view v-else class="flex gap-[10rpx] py-[50rpx]">
        <view>正在验证</view>
        <view class="flex gap-[10rpx]">
          <text class="font-bold">手机号实名身份凭证</text>
          <up-loading-icon mode="semicircle" color="blue" size="20"></up-loading-icon>
        </view>
      </view>
      <!-- 验证成功显示确认导入按钮 -->
      <view v-if="allItemsComplete && allItemsSuccess" class="mt-[50rpx]">
        <button class="bg-[#db0011] text-white text-[30rpx]" @click="handleConfirm">确认导入</button>
      </view>
      <!-- 验证失败时的取消按钮 -->
      <view v-if="allItemsComplete && !allItemsSuccess && verifyError" class="mt-[50rpx]">
        <button class="bg-[#db0011] text-white text-[30rpx]" @click="handleCancel">关闭</button>
      </view>
    </view>
  </up-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useVerificationStore } from '@/stores';

const verificationStore = useVerificationStore();

// 从 store 中获取验证状态
const verifyItems = computed(() => verificationStore.verifyItems);
const verifyError = computed(() => verificationStore.verifyError);

// 检查是否所有验证项都已完成（成功或失败）
const allItemsComplete = computed(() => {
  return verifyItems.value.every(
    (item) =>
      item.status === 'success' || item.status === 'error' || item.status === 'stopped' || item.status === 'api-error'
  );
});

// 检查是否所有验证项都成功
const allItemsSuccess = computed(() => {
  return verifyItems.value.every((item) => item.status === 'success');
});

// Modal 显示控制
const showModal = ref(false);
defineExpose({
  showModal: () => {
    showModal.value = true;
  }
});

const emits = defineEmits(['fillFromCredential']);
// 监听验证失败，显示 modal
watch(
  () => verificationStore.verifyError,
  (error) => {
    if (error && !verificationStore.allVerified) {
      showModal.value = true;
    }
  }
);

/** 处理取消按钮，返回首页 */
const handleCancel = () => {
  showModal.value = false;
};
const handleConfirm = () => {
  emits('fillFromCredential');
  showModal.value = false;
};
</script>

<style scoped lang="scss"></style>
