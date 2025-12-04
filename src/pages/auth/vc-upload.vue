<!--
 * @Description: VC上传页面
-->
<template>
  <view class="page-container">
    <view class="content-wrapper">
      <view class="header">
        <text class="title">上传 VC 凭证</text>
        <text class="subtitle">请上传您的可验证凭证完成认证</text>
      </view>

      <view class="upload-card">
        <view class="upload-area" @click="handleSelectFile">
          <view v-if="!vcFile" class="upload-placeholder">
            <van-icon name="add-o" size="48px" color="#999" />
            <text class="upload-text">点击上传 VC 文件</text>
            <text class="upload-hint">支持 JSON 格式</text>
          </view>

          <view v-else class="file-preview">
            <van-icon name="description" size="48px" color="#db0011" />
            <text class="file-name">{{ vcFile.name }}</text>
            <text class="file-size">{{ formatFileSize(vcFile.size) }}</text>
            <van-button type="default" size="small" plain round class="change-btn" @click.stop="handleSelectFile">
              重新选择
            </van-button>
          </view>
        </view>
      </view>

      <!-- VC 内容预览 -->
      <view v-if="vcContent" class="preview-card">
        <view class="preview-header">
          <text class="preview-title">VC 内容预览</text>
        </view>
        <view class="preview-content">
          <text class="preview-text">{{ vcContent }}</text>
        </view>
      </view>

      <view class="submit-section">
        <van-button type="primary" block round :loading="uploading" :disabled="!vcFile" @click="handleSubmit">
          提交验证
        </van-button>
      </view>

      <view class="tips-section">
        <text class="tips-title">温馨提示：</text>
        <text class="tips-item">1. 请确保上传的 VC 文件格式正确</text>
        <text class="tips-item">2. VC 凭证需在有效期内</text>
        <text class="tips-item">3. 提交后系统将自动验证凭证有效性</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface VcFile {
  name: string;
  size: number;
  path: string;
}

const vcFile = ref<VcFile | null>(null);
const vcContent = ref('');
const uploading = ref(false);

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
};

// 选择文件
const handleSelectFile = () => {
  // #ifdef H5
  // H5 端使用 input file
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      vcFile.value = {
        name: file.name,
        size: file.size,
        path: URL.createObjectURL(file)
      };

      // 读取文件内容预览
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const json = JSON.parse(content);
          vcContent.value = JSON.stringify(json, null, 2);
        } catch {
          vcContent.value = '无法解析文件内容';
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
  // #endif

  // #ifndef H5
  // 小程序端使用 chooseMessageFile
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['json'],
    success: (res) => {
      const file = res.tempFiles[0];
      vcFile.value = {
        name: file.name,
        size: file.size,
        path: file.path
      };

      // 读取文件内容
      uni.getFileSystemManager().readFile({
        filePath: file.path,
        encoding: 'utf-8',
        success: (data) => {
          try {
            const json = JSON.parse(data.data as string);
            vcContent.value = JSON.stringify(json, null, 2);
          } catch {
            vcContent.value = '无法解析文件内容';
          }
        }
      });
    },
    fail: (err) => {
      console.error('选择文件失败:', err);
    }
  });
  // #endif
};

// 提交验证
const handleSubmit = async () => {
  if (!vcFile.value) {
    uni.showToast({
      title: '请先上传 VC 文件',
      icon: 'none'
    });
    return;
  }

  uploading.value = true;

  try {
    // 模拟上传和验证过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 模拟验证结果
    const isValid = Math.random() > 0.3;

    if (isValid) {
      uni.showToast({
        title: '验证成功',
        icon: 'success'
      });

      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/auth/auth-login'
        });
      }, 1500);
    } else {
      uni.showToast({
        title: 'VC 凭证验证失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('提交失败:', error);
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none'
    });
  } finally {
    uploading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24px;
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 24px;

  .title {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .subtitle {
    display: block;
    font-size: 14px;
    color: #999;
  }
}

.upload-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.upload-area {
  padding: 32px;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 32px;
  transition: border-color 0.3s;

  &:hover {
    border-color: #db0011;
  }

  .upload-text {
    display: block;
    font-size: 16px;
    color: #333;
    margin-top: 12px;
  }

  .upload-hint {
    display: block;
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;

  .file-name {
    display: block;
    font-size: 14px;
    color: #333;
    margin-top: 12px;
    word-break: break-all;
    text-align: center;
  }

  .file-size {
    display: block;
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }

  .change-btn {
    margin-top: 12px;
  }
}

.preview-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-top: 16px;

  .preview-header {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;

    .preview-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
  }

  .preview-content {
    padding: 16px;
    max-height: 200px;
    overflow: auto;

    .preview-text {
      font-size: 12px;
      color: #666;
      font-family: monospace;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}

.submit-section {
  margin-top: 24px;
}

.tips-section {
  margin-top: 24px;
  padding: 16px;
  background: #fff8e6;
  border-radius: 8px;

  .tips-title {
    display: block;
    font-size: 14px;
    font-weight: bold;
    color: #ff976a;
    margin-bottom: 8px;
  }

  .tips-item {
    display: block;
    font-size: 12px;
    color: #999;
    line-height: 1.8;
  }
}
</style>
