<!--
 * @Author: git.name
 * @Date: 2025-12-10
 * @LastEditors: zhoudandan
 * @LastEditTime: 2025-12-20 10:47:44
 * @Description: 注册页面
-->
<template>
  <PageContainer>
    <!-- 顶部导航栏 -->
    <Header></Header>
    <view class="thanks">10分钟内轻松开户</view>
    <view class="px-[32rpx] mt-[40rpx]">
      <view v-for="(item, index) in stepValue" :key="index">
        <view class="flex gap-[30rpx]">
          <view class="bg-black w-[60rpx] h-[60rpx] rounded-full text-white flex justify-center items-center">
            {{ index + 1 }}
          </view>
          <view class="flex-1 text-[30rpx] mt-[8rpx]">{{ item }}</view>
        </view>
        <view v-if="index < 2" class="w-[6rpx] h-[50rpx] bg-black ml-[27rpx]"></view>
      </view>
    </view>
    <!-- 文字描述 -->
    <view class="px-[32rpx] mt-[80rpx] text-[30rpx]">
      <view>
        <view class="text-[44rpx]">申请资格</view>
        <view class="flex gap-[20rpx] mt-[50rpx]">
          <up-icon name="checkmark" size="28" color="#028580"></up-icon>
          <view class="text-[30rpx] leading-[46rpx]">
            <b>年满18岁但未满76岁</b>
            ，并且未持有任何香港汇丰产品;否则请前往附近的分行，本行职员将会帮助您完成手机开户。
          </view>
        </view>
        <view class="flex gap-[20rpx] mt-[20rpx]">
          <up-icon name="checkmark" size="28" color="#028580"></up-icon>
          <view class="text-[30rpx] leading-[46rpx]">
            您须持有有效期不少于6个月的
            <b>往来港澳通行证或护照</b>
            ，且由15个指定国家 / 地区所签发。
            <br />
            <u>15个指定国家 / 地区所签发的护照</u>
          </view>
        </view>
        <view class="flex gap-[20rpx] mt-[20rpx]">
          <up-icon name="checkmark" size="28" color="#028580"></up-icon>
          <view class="text-[30rpx] leading-[46rpx] flex-1">
            提交申请时您必须
            <b>身在香港</b>
          </view>
        </view>
      </view>
      <view class="leading-[46rpx] mt-[50rpx]">
        如果您需要任何帮助,请前往附近的分行，本行职员将会帮助您完成手机开户。
      </view>
      <view class="leading-[46rpx] mt-[50rpx]">
        如需申请需要签名式样的产品或服务（例如申请支 票簿），您将需前往香港的汇丰分行提供签名。
      </view>
      <view class="leading-[46rpx] mt-[50rpx]">
        选择"同意并继续"即代表您明白和同意下列声明：
        <br />
        1）汇丰会按照《资料私隐通知》的指引使用您的个人资料
        <br />
        2）您同意汇丰使用您的资料用于身份验证
        <br />
        3）您确认符合汇丰账户的申请资格
      </view>
      <view class="flex items-center mt-[50rpx] gap-[10rpx]">
        <view><up-icon name="info-circle-fill" size="26" color="#305a85"></up-icon></view>
        <view class="text-[#305a85]">请您以英文输入您的资料。</view>
      </view>
    </view>
    <!-- 按钮 -->
    <view class="flex px-[32rpx] mt-[50rpx]">
      <view class="flex w-2/5 items-center gap-[20rpx]" @click="onBackStep">
        <view><up-icon name="arrow-left" size="24" bold color="#db0011" /></view>
        <view>返回</view>
      </view>
      <view class="submit-button" @click="tostepThree">
        <text class="submit-button-text">同意并继续</text>
      </view>
    </view>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';

const stepValue = ref([
  '申请开立汇丰香港账户',
  '注册手机银行',
  '经邮寄获取自动柜员机卡和密码。如果您身在汇丰分行,也可直接在分行领取'
]);
const tostepThree = () => {
  uni.navigateTo({
    url: '/pages/register/selectAccount'
  });
};
const onBackStep = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #fff;
  padding-top: 98rpx;
  padding-bottom: 100rpx;
}

.thanks {
  padding: 0rpx 32rpx;
  padding-top: calc(50rpx + var(--status-bar-height));
  font-size: 50rpx;
  font-weight: 600;
}

// 提交按钮 Footer
.submit-footer {
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
