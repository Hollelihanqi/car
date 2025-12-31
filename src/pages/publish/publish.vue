<template>
  <PageContainer>
    <view class="form-container">
      <!-- 拼车类型 -->
      <view class="form-section">
        <view class="section-header">
          <view class="section-title">拼车类型</view>
          <view class="import-btn" @click="importLastRecord">
            <text class="import-text">导入上次</text>
          </view>
        </view>
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
        <view class="section-subtitle">路线信息</view>
        <view class="form-item">
          <text class="label required">出发地</text>
          <input v-model="form.fromLocation" class="input" placeholder="请输入出发地" placeholder-class="placeholder" />
        </view>
        <view class="form-item">
          <text class="label required">目的地</text>
          <input v-model="form.toLocation" class="input" placeholder="请输入目的地" placeholder-class="placeholder" />
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

        <!-- 座位数（车找人时显示） -->
        <view v-if="form.type === 'offer'" class="form-item">
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

        <!-- 联系方式 -->
        <view class="divider"></view>
        <view class="section-subtitle">联系方式</view>
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

        <!-- 备注说明 -->
        <view class="divider"></view>
        <view class="section-subtitle">备注说明</view>
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
// 定义表单类型，确保 contact 存在
type CarPoolForm = Omit<CarPoolInfo, 'id' | 'userId' | 'createTime' | 'status' | 'viewCount'>;

const form = reactive<CarPoolForm>({
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

// 导入上次发布记录
const importLastRecord = () => {
  // TODO: 从本地存储或云端获取最近一次的发布记录
  // const lastRecord = uni.getStorageSync('lastPublishRecord')

  // 模拟导入上次的数据
  const lastRecord = uni.getStorageSync('lastPublishRecord');

  if (!lastRecord) {
    uni.showToast({
      title: '暂无历史记录',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  uni.showModal({
    title: '确认导入',
    content: '将导入上次发布的信息，是否继续？',
    success: (res) => {
      if (res.confirm) {
        // 导入数据
        form.type = lastRecord.type;
        form.fromLocation = lastRecord.fromLocation;
        form.toLocation = lastRecord.toLocation;
        form.seats = lastRecord.seats || 1;
        form.contact.name = lastRecord.contact.name;
        form.contact.phone = lastRecord.contact.phone;
        form.contact.wechat = lastRecord.contact.wechat || '';
        form.remark = lastRecord.remark || '';

        uni.showToast({
          title: '导入成功',
          icon: 'success',
          duration: 2000
        });
      }
    }
  });
};

// 验证表单
const validateForm = (): boolean => {
  if (!form.fromLocation || form.fromLocation.trim() === '') {
    uni.showToast({ title: '请输入出发地', icon: 'none' });
    return false;
  }
  if (!form.toLocation || form.toLocation.trim() === '') {
    uni.showToast({ title: '请输入目的地', icon: 'none' });
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

    // 保存本次发布记录到本地存储
    uni.setStorageSync('lastPublishRecord', {
      type: form.type,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      seats: form.seats,
      contact: {
        name: form.contact.name,
        phone: form.contact.phone,
        wechat: form.contact.wechat
      },
      remark: form.remark
    });

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

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .section-subtitle {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }

  .divider {
    height: 1rpx;
    background: #f0f0f0;
    margin: 32rpx 0;
  }

  .import-btn {
    padding: 10rpx 24rpx;
    background: #ff6b00;
    border-radius: 20rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }

    .import-text {
      font-size: 24rpx;
      color: #fff;
      font-weight: 600;
    }
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
    padding: 16rpx 8rpx;
    background-color: #f8f8f8;
    border-radius: 16rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s;

    .icon {
      font-size: 32rpx;
      margin-bottom: 6rpx;
    }

    .label {
      font-size: 24rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 2rpx;
    }

    .desc {
      font-size: 20rpx;
      color: #999;
    }

    &.active {
      background-color: #fff3e0;
      border-color: #ff6b00;

      .label {
        color: #ff6b00;
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
    height: 80rpx;
    padding: 0 30rpx;
    background-color: #f8f8f8;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
    line-height: 80rpx;

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
    box-sizing: border-box;

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
      background-color: #fff3e0;
      border-color: #ff6b00;
      color: #ff6b00;
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
    background: linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%);
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
