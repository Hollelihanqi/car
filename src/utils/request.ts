/**
 * 统一请求封装
 * 基于 uni.request 封装的 HTTP 请求工具
 */

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

interface RequestResponse<T = any> {
  data: T;
  statusCode: number;
  header: Record<string, string>;
}

// 基础配置
const BASE_URL = 'http://10.0.48.22:9011'; // TODO: 替换为实际的 API 域名
const TIMEOUT = 360000; // 120秒超时

/**
 * 统一请求方法
 */
const request = <T = any>(config: RequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data, header = {}, timeout = TIMEOUT } = config;

    // 构建完整 URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    // 统一请求头
    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVuZGlkIiwiaWF0IjoxNzY1MjU3NzcxfQ.ksbETIMO7dUFAwbQIr_e7cKTHNM662W5DFbF6NcajQs',
      ...header
    };

    uni.request({
      url: fullUrl,
      method,
      data,
      header: headers,
      timeout,
      success: (res: RequestResponse<any>) => {
        const { statusCode, data } = res;

        // HTTP 状态码判断
        if (statusCode >= 200 && statusCode < 300) {
          // 直接返回响应数据（接口直接返回结果对象，无统一包装）
          resolve(data);
        } else {
          const errorMsg = `请求失败: ${statusCode}`;
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
          reject(new Error(errorMsg));
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
        const errorMsg = err.errMsg || '网络请求失败';
        uni.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
        reject(new Error(errorMsg));
      }
    });
  });
};

/**
 * GET 请求
 */
export const get = <T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url: params ? `${url}?${new URLSearchParams(params).toString()}` : url,
    method: 'GET',
    ...config
  });
};

/**
 * POST 请求
 */
export const post = <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...config
  });
};

/**
 * PUT 请求
 */
export const put = <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...config
  });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url,
    method: 'DELETE',
    data,
    ...config
  });
};

export default request;
