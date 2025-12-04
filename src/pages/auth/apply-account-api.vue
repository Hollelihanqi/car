<template>
  <view class="!h-screen flex items-center justify-center p-6">
    <view class="w-full max-w-[400px]">
      <view class="text-center mb-6">
        <text class="block text-2xl font-bold text-gray-800">账号申请</text>
      </view>

      <view class="bg-white rounded-xl overflow-hidden shadow-md">
        <van-form ref="formRef" @submit="handleSubmit">
          <van-cell-group>
            <van-field
              v-model="formData.name"
              name="name"
              label="姓名"
              placeholder="请输入姓名"
              clearable
              :rules="[{ required: true, message: '请输入姓名' }]"
            />

            <van-field
              v-model="formData.phone"
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
              type="tel"
              maxlength="11"
              clearable
              :rules="[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]"
            />

            <van-field
              v-model="formData.duration"
              name="duration"
              label="上网时长"
              placeholder="请输入上网时长（小时）"
              type="digit"
              clearable
              :rules="[{ required: true, message: '请输入上网时长' }]"
            />
          </van-cell-group>
        </van-form>
      </view>

      <view class="mt-6">
        <van-button type="primary" block round :loading="loading" @click="handleSubmit">提交申请</van-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const formRef = ref();
const loading = ref(false);

const formData = reactive({
  name: '',
  phone: '',
  duration: ''
});

const handleSubmit = async () => {
  try {
    loading.value = true;

    // TODO: 调用后端接口
    // const res = await applyAccountApi({
    //   name: formData.name,
    //   phone: formData.phone,
    //   duration: Number(formData.duration)
    // });

    // 模拟接口调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    uni.showToast({
      title: '申请成功',
      icon: 'success'
    });

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error('表单验证失败或接口错误:', error);
  } finally {
    loading.value = false;
  }
};
</script>
