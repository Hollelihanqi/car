<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 10:48:19
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="thanks">您想申请那个账户？</view>

    <!-- 文字描述 -->
    <view class="px-[32rpx] text-[30rpx] leading-[46rpx]">
      <up-radio-group v-model="value" placement="column" size="30" iconSize="24">
        <view
          v-for="item in changeText"
          :key="item.title"
          class="border border-solid border-black p-[30rpx] mt-[30rpx]"
        >
          <view class="flex justify-between items-center">
            <view>{{ item.title }}</view>
            <view><up-radio activeColor="red" :name="item.title"></up-radio></view>
          </view>
          <view
            class="h-[350rpx] w-full mt-[30rpx] flex justify-center items-center"
            :style="'background-color: ' + item.bgColor"
          >
            <img :src="item.imageUrl" class="h-[280rpx]" />
          </view>

          <view class="mt-[30rpx]">{{ item.content }}</view>
          <view class="flex mt-[30rpx] gap-[10rpx]">
            <view><up-icon name="info-circle-fill" size="24" color="#305a85"></up-icon></view>
            <view class="text-[28rpx] leading-[40rpx]">{{ item.tips }}</view>
          </view>
          <view class="mt-[30rpx] flex items-center gap-[10rpx] pb-[30rpx]">
            <view class="font-bold">了解更多</view>
            <view>
              <up-icon name="play-right-fill" color="#db0011" />
            </view>
          </view>
        </view>
      </up-radio-group>
    </view>
    <!-- 按钮 -->
    <view class="submit-footer">
      <view class="submit-button" @click="tostepTwo">
        <text class="submit-button-text">立刻申请</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';
const changeText = ref([
  {
    title: '汇丰卓越理财',
    imageUrl: '/static/bg3-1.png',
    content: '豁免首6个月服务费。让您体验尊属的环球财富管理服务及环球教育支援、医疗保健、旅游及时尚品味等尊属礼遇。',
    tips: '其后"全面理财总值"最低要求为港币1,000,000元。',
    bgColor: '#730014'
  },
  {
    title: '汇丰One',
    imageUrl: '/static/bg3-2.png',
    content: '一站式综合账户,满足您的所有理财需求',
    tips: '无最低余额要求',
    bgColor: '#fff'
  }
]);
const value = ref('汇丰One');
const tostepTwo = () => {
  uni.navigateTo({
    url: '/pages/register/reason'
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #fff;
  padding-top: 98rpx;
  padding-bottom: 150rpx;
}

.thanks {
  padding: 0rpx 32rpx;
  padding-top: 50rpx;
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
  border: 3rpx solid #db0011;
}

.submit-button-text {
  font-size: 30rpx;
  color: #fff;
}
</style>
