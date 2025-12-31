import type { CarPoolInfo, FilterParams, PageParams, PageResponse, UserInfo } from '@/typings/carpool';
import { callCarpoolFunction, callUserFunction } from '@/utils/cloud';

/**
 * 获取拼车信息列表
 */
export const getCarPoolList = (params: FilterParams & PageParams) => {
  return callCarpoolFunction<PageResponse<CarPoolInfo>>('getList', params);
};

/**
 * 获取拼车详情
 */
export const getCarPoolDetail = (id: string) => {
  return callCarpoolFunction<CarPoolInfo>('getDetail', { id });
};

/**
 * 发布拼车信息
 */
export const publishCarPool = (data: Partial<CarPoolInfo>) => {
  return callCarpoolFunction<{ id: string }>('publish', data);
};

/**
 * 更新拼车信息
 */
export const updateCarPool = (id: string, data: Partial<CarPoolInfo>) => {
  return callCarpoolFunction<boolean>('update', { id, updates: data });
};

/**
 * 取消拼车信息
 */
export const cancelCarPool = (id: string) => {
  return callCarpoolFunction<boolean>('cancel', { id });
};

/**
 * 删除拼车信息
 */
export const deleteCarPool = (id: string) => {
  return callCarpoolFunction<boolean>('delete', { id });
};

/**
 * 获取我的发布列表
 */
export const getMyCarPoolList = (params: PageParams) => {
  return callCarpoolFunction<PageResponse<CarPoolInfo>>('getMyList', params);
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return callUserFunction<UserInfo>('getInfo');
};

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return callUserFunction<boolean>('update', data);
};

/**
 * 增加浏览次数
 */
export const increaseViewCount = (id: string) => {
  return callCarpoolFunction<boolean>('increaseView', { id });
};
