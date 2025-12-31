// 云函数公共配置
module.exports = {
  // 微信小程序配置
  wechat: {
    appid: 'YOUR_APPID', // 替换为你的小程序 appid
    secret: 'YOUR_SECRET' // 替换为你的小程序 secret
  },

  // 数据库表名
  tables: {
    carpool: 'carpool',
    users: 'users'
  },

  // 拼车状态
  carpoolStatus: {
    ACTIVE: 'active', // 进行中
    EXPIRED: 'expired', // 已过期
    CANCELLED: 'cancelled' // 已取消
  },

  // 拼车类型
  carpoolType: {
    OFFER: 'offer', // 车找人
    REQUEST: 'request' // 人找车
  },

  // 分页默认配置
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    maxPageSize: 100
  }
};
