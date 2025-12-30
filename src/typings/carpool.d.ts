/**
 * 拼车信息类型
 */
export interface CarPoolInfo {
  id: string
  // 拼车类型: 'offer' 车主提供车位, 'request' 乘客求拼车
  type: 'offer' | 'request'
  // 出发地
  fromLocation: string
  // 目的地
  toLocation: string
  // 出发时间
  departureTime: string
  // 座位数（车主提供时）
  seats?: number
  // 联系方式
  contact: {
    name: string
    phone: string
    wechat?: string
  }
  // 备注说明
  remark?: string
  // 发布者ID
  userId: string
  // 发布时间
  createTime: string
  // 状态: 'active' 有效, 'expired' 已过期, 'cancelled' 已取消
  status: 'active' | 'expired' | 'cancelled'
  // 浏览次数
  viewCount: number
}

/**
 * 用户信息类型
 */
export interface UserInfo {
  id: string
  nickName: string
  avatarUrl: string
  phone?: string
  wechat?: string
  // 信用评分
  creditScore: number
  // 发布次数
  publishCount: number
  // 注册时间
  registerTime: string
}

/**
 * 筛选条件类型
 */
export interface FilterParams {
  type?: 'offer' | 'request' | 'all'
  fromLocation?: string
  toLocation?: string
  date?: string
}

/**
 * 分页参数
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
