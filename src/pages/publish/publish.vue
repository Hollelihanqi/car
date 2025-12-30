<template>
  <PageContainer>
    <view class="form-container">
      <!-- 拼车类型 -->
      <view class="form-section">
        <view class="section-title">拼车类型</view>
        <view class="type-selector">
          <view class="type-item" :class="{ active: form.type === 'offer' }" @click="form.type = 'offer'">
            <text class="icon">🚗</text>
            <text class="label">车找人</text>
            <text class="desc">我有车，找乘客</text>
          </view>
          <view class="type-item" :class="{ active: form.type === 'request' }" @click="form.type = 'request'">
            <text class="icon">🙋</text>
            <text class="label">人找车</text>
            <text class="desc">我要拼车</text>
          </view>
        </view>
      </view>

      <!-- 路线信息 -->
      <view class="form-section">
        <view class="section-title">路线信息</view>
        <view class="form-item">
          <text class="label required">出发地</text>
          <picker :value="fromIndex" :range="locations" @change="handleFromChange">
            <view class="picker" :class="{ placeholder: fromIndex === 0 }">
              {{ fromIndex === 0 ? '请选择出发地' : locations[fromIndex] }}
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label required">目的地</text>
          <picker :value="toIndex" :range="locations" @change="handleToChange">
            <view class="picker" :class="{ placeholder: toIndex === 0 }">
              {{ toIndex === 0 ? '请选择目的地' : locations[toIndex] }}
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label required">出发时间</text>
          <picker
            mode="multiSelector"
            :value="[dateIndex, timeIndex]"
            :range="[dateList, timeList]"
            @change="handleTimeChange"
          >
            <view class="picker" :class="{ placeholder: !form.departureTime }">
              {{ form.departureTime || '请选择出发时间' }}
            </view>
          </picker>
        </view>
      </view>

      <!-- 座位数（车找人时显示） -->
      <view v-if="form.type === 'offer'" class="form-section">
        <view class="section-title">座位数</view>
        <view class="form-item">
          <text class="label required">剩余座位</text>
          <view class="seat-selector">
            <view
              v-for="n in 4"
              :key="n"
              class="seat-item"
              :class="{ active: form.seats === n }"
              @click="form.seats = n"
            >
              {{ n }}人
            </view>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <view class="section-title">联系方式</view>
        <view class="form-item">
          <text class="label required">姓名</text>
          <input
            v-model="form.contact.name"
            class="input"
            placeholder="请输入您的姓名"
            placeholder-class="placeholder"
          />
        </view>
        <view class="form-item">
          <text class="label required">手机号</text>
          <input
            v-model="form.contact.phone"
            class="input"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            placeholder-class="placeholder"
          />
        </view>
        <view class="form-item">
          <text class="label">微信号</text>
          <input
            v-model="form.contact.wechat"
            class="input"
            placeholder="选填，方便联系"
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <!-- 备注说明 -->
      <view class="form-section">
        <view class="section-title">备注说明</view>
        <view class="form-item">
          <textarea
            v-model="form.remark"
            class="textarea"
            placeholder="补充说明，如：长期拼车、准时出发等"
            placeholder-class="placeholder"
            maxlength="200"
          />
          <view class="word-count">{{ form.remark?.length || 0 }}/200</view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="handleSubmit">发布</button>
        <view class="tips">
          <text class="tips-icon">ℹ️</text>
          <text class="tips-text">发布信息仅用于拼车联系，请注意个人信息安全</text>
        </view>
      </view>
    </view>

    <!-- TabBar -->
    <TabBar />
  </PageContainer>
</template>

<script setup lang="ts">
import type { CarPoolInfo } from '@/typings/carpool';
// import { publishCarPool } from '@/api/carpool';
import PageContainer from '@/components/PageContainer.vue';
import TabBar from '@/components/TabBar.vue';
defineOptions({
  name: 'PublishPage'
});

// 地点列表
const locations = ['请选择', '西安市内', '西咸新区', '高新区', '曲江新区', '经开区', '浐灞新区'];
const fromIndex = ref(0);
const toIndex = ref(0);

// 日期和时间列表
const dateList = ref<string[]>([]);
const timeList = ref<string[]>([]);
const dateIndex = ref(0);
const timeIndex = ref(0);

// 初始化日期和时间选项
const initDateTime = () => {
  // 生成未来7天的日期
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    const label = i === 0 ? '今天' : i === 1 ? '明天' : `${month}月${day}日`;
    dates.push(`${label} ${weekday}`);
  }
  dateList.value = dates;

  // 生成时间选项（6:00 - 23:30，每30分钟一个选项）
  const times: string[] = [];
  for (let h = 6; h <= 23; h++) {
    times.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 23) {
      times.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }
  timeList.value = times;
};

initDateTime();

// 表单数据
const form = reactive<Partial<CarPoolInfo>>({
  type: 'offer',
  fromLocation: '',
  toLocation: '',
  departureTime: '',
  seats: 1,
  contact: {
    name: '',
    phone: '',
    wechat: ''
  },
  remark: ''
});

// 选择出发地
const handleFromChange = (e: any) => {
  fromIndex.value = e.detail.value;
  if (fromIndex.value > 0) {
    form.fromLocation = locations[fromIndex.value];
  }
};

// 选择目的地
const handleToChange = (e: any) => {
  toIndex.value = e.detail.value;
  if (toIndex.value > 0) {
    form.toLocation = locations[toIndex.value];
  }
};

// 选择时间
const handleTimeChange = (e: any) => {
  const [dIndex, tIndex] = e.detail.value;
  dateIndex.value = dIndex;
  timeIndex.value = tIndex;

  // 计算实际日期时间
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + dIndex);

  const [hour, minute] = timeList.value[tIndex].split(':');
  targetDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

  form.departureTime = `${dateList.value[dIndex]} ${timeList.value[tIndex]}`;
};

// 验证表单
const validateForm = (): boolean => {
  if (fromIndex.value === 0) {
    uni.showToast({ title: '请选择出发地', icon: 'none' });
    return false;
  }
  if (toIndex.value === 0) {
    uni.showToast({ title: '请选择目的地', icon: 'none' });
    return false;
  }
  if (!form.departureTime) {
    uni.showToast({ title: '请选择出发时间', icon: 'none' });
    return false;
  }
  if (!form.contact.name) {
    uni.showToast({ title: '请输入姓名', icon: 'none' });
    return false;
  }
  if (!form.contact.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return false;
  }
  if (!/^1[3-9]\d{9}$/.test(form.contact.phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' });
    return false;
  }
  return true;
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return;

  uni.showLoading({ title: '发布中...' });

  try {
    // TODO: 实际调用云函数API
    // const res = await publishCarPool(form)

    // 模拟发布成功
    await new Promise((resolve) => setTimeout(resolve, 1000));

    uni.hideLoading();
    uni.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 2000
    });

    // 延迟跳转到首页
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }, 2000);
  } catch (error) {
    uni.hideLoading();
    console.error('发布失败', error);
    uni.showToast({
      title: '发布失败，请重试',
      icon: 'none'
    });
  }
};
</script>

<style lang="scss" scoped>
:deep(.page-container) {
  padding-bottom: 150rpx; // 留出TabBar空间
}

.form-container {
  padding: 20rpx 30rpx;
}

.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
}

.type-selector {
  display: flex;
  gap: 20rpx;

  .type-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 20rpx;
    background-color: #f8f8f8;
    border-radius: 16rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s;

    .icon {
      font-size: 60rpx;
      margin-bottom: 15rpx;
    }

    .label {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .desc {
      font-size: 24rpx;
      color: #999;
    }

    &.active {
      background-color: #e6f7f9;
      border-color: #62a9c8;

      .label {
        color: #62a9c8;
      }
    }
  }
}

.form-item {
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;

    &.required::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4rpx;
    }
  }

  .picker,
  .input {
    width: 100%;
    padding: 20rpx 30rpx;
    background-color: #f8f8f8;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;

    &.placeholder {
      color: #999;
    }
  }

  .input::placeholder {
    color: #999;
  }

  .textarea {
    width: 100%;
    padding: 20rpx 30rpx;
    background-color: #f8f8f8;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    min-height: 200rpx;

    &::placeholder {
      color: #999;
    }
  }

  .word-count {
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
  }
}

.seat-selector {
  display: flex;
  gap: 20rpx;

  .seat-item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    background-color: #f8f8f8;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    border: 2rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background-color: #e6f7f9;
      border-color: #62a9c8;
      color: #62a9c8;
      font-weight: bold;
    }
  }
}

.submit-section {
  margin-top: 40rpx;

  .submit-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: linear-gradient(135deg, #62a9c8 0%, #147ebc 100%);
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    border: none;

    &::after {
      border: none;
    }
  }

  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30rpx;
    padding: 0 30rpx;

    .tips-icon {
      font-size: 28rpx;
      margin-right: 10rpx;
    }

    .tips-text {
      font-size: 24rpx;
      color: #999;
      line-height: 1.6;
    }
  }
}
</style>
