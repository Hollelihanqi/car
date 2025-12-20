<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 14:13:03
 * @Description: 注册页面
-->
<template>
  <view>
    <view class="page-title">选择国家或地区编号</view>
    <view class="mx-[32rpx] mt-[50rpx]">
      <view class="flex border-0 border-b border-solid border-[#767676]">
        <view class="flex items-center">
          <view><up-icon name="search" size="30" /></view>
        </view>
        <input v-model="searchValue" class="form-input border-0!" placeholder="搜索国家或地区" @change="onSearch" />
      </view>
      <view>
        <view class="flex flex-col gap-[50rpx] py-[50rpx] border-0 border-b border-solid border-[#ccc]">
          <view class="text-[34rpx]">香港特别行政区（+852）</view>
          <view class="text-[34rpx]" @click="closeCode">中国（+86）</view>
        </view>
        <view class="flex flex-col gap-[50rpx] py-[50rpx]">
          <view v-for="item in areaCodeValue" :key="item.value" class="text-[34rpx]">
            {{ `${item.label}（+${item.value}）` }}
          </view>
        </view>
      </view>
    </view>
    <!-- 按钮 -->
    <view class="flex submit-footer mb-[20rpx]">
      <view class="flex w-2/5 items-center gap-[20rpx]" @click="closeCode">
        <view><up-icon name="arrow-left" size="24" bold color="#db0011" /></view>
        <view>返回</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const emits = defineEmits(['changeAreaCode']);
const searchValue = ref('');
const areaCodeValue = ref([
  {
    value: '93',
    label: '阿富汗'
  },
  {
    value: '358',
    label: '奥兰群岛'
  },
  {
    value: '355',
    label: '阿尔巴尼亚'
  },
  {
    value: '213',
    label: '阿尔及利亚'
  },
  {
    value: '1',
    label: '美属萨摩亚'
  },
  {
    value: '376',
    label: '安道尔'
  },
  {
    value: '244',
    label: '安哥拉'
  }
]);
const onSearch = (e: Event) => {
  console.log(e);
};
const closeCode = () => {
  emits('changeAreaCode');
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #fff;
  padding-top: 98rpx;
  padding-bottom: 100rpx;
}

.page-title {
  padding: 0rpx 32rpx;
  padding-top: calc(50rpx + var(--status-bar-height));
  font-size: 50rpx;
  font-weight: 600;
}

.banner-image {
  width: 100%;
  height: 200px;
  padding-top: 60rpx;
  background-color: #fff;
  margin-bottom: 30rpx;
}
// 提交按钮 Footer
.submit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 32rpx;
  background: #fff;
  box-sizing: border-box;
  z-index: 100;
  padding-bottom: 30rpx;
}

.submit-button {
  width: 100%;
  height: 45px;
  background: #db0011;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button-text {
  font-size: 30rpx;
  color: #fff;
}
.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: transparent;
  border-bottom: 1rpx solid #767676;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}
.error-tip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
  padding: 12rpx 16rpx;
  background: #fff5f5;
  border: 1rpx solid #ff6b6b;
  border-left: 4rpx solid #ff6b6b;
}

.error-icon-wrapper {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #ff9800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-text {
  font-size: 24rpx;
  color: #ff6b6b;
  flex: 1;
}
</style>
