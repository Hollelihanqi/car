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
  baseURL?: string; // 自定义 baseURL
  authorization?: string; // 自定义 Authorization
}

interface RequestResponse<T = any> {
  data: T;
  statusCode: number;
  header: Record<string, string>;
}

// 基础配置
const BASE_URL = 'http://60.247.61.162:12200'; // VC验证接口的 baseURL
export const BASE_URL_MOBILE = 'http://10.0.158.84:9005'; // 手机号验证接口的 baseURL
const TIMEOUT = 720000; // 120秒超时
export const DEFAULT_AUTHORIZATION =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVuZGlkIiwiaWF0IjoxNzY1MjU3NzcxfQ.ksbETIMO7dUFAwbQIr_e7cKTHNM662W5DFbF6NcajQs'; // VC验证接口的 Authorization
export const MOBILE_AUTHORIZATION =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNzY1MTc3MzM3fQ.WbJbhVf3hM-Lp4y35AeMUtY2Nt9Z323h07-2H1qAWvk'; // 手机号验证接口的 Authorization

/**
 * 统一请求方法
 */
const request = <T = any>(config: RequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data, header = {}, timeout = TIMEOUT, baseURL, authorization } = config;

    // 构建完整 URL
    const baseUrl = baseURL || BASE_URL;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    // 统一请求头
    const authToken = authorization !== undefined ? authorization : DEFAULT_AUTHORIZATION;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authToken,
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
