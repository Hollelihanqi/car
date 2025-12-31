/**
 * uniCloud 云函数调用封装
 */

interface CloudFunctionParams {
  name: string; // 云函数名称
  action: string; // 操作类型
  data?: any; // 请求数据
}

interface CloudResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

/**
 * 调用云函数
 */
export const callCloudFunction = <T = any>(params: CloudFunctionParams): Promise<T> => {
  return new Promise((resolve, reject) => {
    const { name, action, data } = params;

    uniCloud
      .callFunction({
        name,
        data: {
          action,
          data
        }
      })
      .then((res: any) => {
        const result = res.result as CloudResponse<T>;

        if (result.code === 0) {
          resolve(result.data as T);
        } else {
          const errorMsg = result.message || '请求失败';
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
          reject(new Error(errorMsg));
        }
      })
      .catch((err: any) => {
        console.error('云函数调用失败:', err);
        const errorMsg = err.message || '网络请求失败';
        uni.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
        reject(err);
      });
  });
};

/**
 * 调用拼车云函数
 */
export const callCarpoolFunction = <T = any>(action: string, data?: any): Promise<T> => {
  return callCloudFunction<T>({
    name: 'carpool',
    action,
    data
  });
};

/**
 * 调用用户云函数
 */
export const callUserFunction = <T = any>(action: string, data?: any): Promise<T> => {
  return callCloudFunction<T>({
    name: 'user',
    action,
    data
  });
};
