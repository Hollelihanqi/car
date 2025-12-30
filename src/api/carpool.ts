import type { CarPoolInfo, FilterParams, PageParams, PageResponse, UserInfo } from '@/typings/carpool';
import { http } from '@/utils/request';

/**
 * 获取拼车信息列表
 */
export const getCarPoolList = (params: FilterParams & PageParams) => {
  return http<PageResponse<CarPoolInfo>>({
    url: '/carpool/list',
    method: 'GET',
    data: params
  });
};

/**
 * 获取拼车详情
 */
export const getCarPoolDetail = (id: string) => {
  return http<CarPoolInfo>({
    url: `/carpool/detail/${id}`,
    method: 'GET'
  });
};

/**
 * 发布拼车信息
 */
export const publishCarPool = (data: Partial<CarPoolInfo>) => {
  return http<{ id: string }>({
    url: '/carpool/publish',
    method: 'POST',
    data
  });
};

/**
 * 更新拼车信息
 */
export const updateCarPool = (id: string, data: Partial<CarPoolInfo>) => {
  return http<boolean>({
    url: `/carpool/update/${id}`,
    method: 'PUT',
    data
  });
};

/**
 * 取消拼车信息
 */
export const cancelCarPool = (id: string) => {
  return http<boolean>({
    url: `/carpool/cancel/${id}`,
    method: 'POST'
  });
};

/**
 * 删除拼车信息
 */
export const deleteCarPool = (id: string) => {
  return http<boolean>({
    url: `/carpool/delete/${id}`,
    method: 'DELETE'
  });
};

/**
 * 获取我的发布列表
 */
export const getMyCarPoolList = (params: PageParams) => {
  return http<PageResponse<CarPoolInfo>>({
    url: '/carpool/my',
    method: 'GET',
    data: params
  });
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return http<UserInfo>({
    url: '/user/info',
    method: 'GET'
  });
};

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return http<boolean>({
    url: '/user/update',
    method: 'PUT',
    data
  });
};

/**
 * 增加浏览次数
 */
export const increaseViewCount = (id: string) => {
  return http<boolean>({
    url: `/carpool/view/${id}`,
    method: 'POST'
  });
};
