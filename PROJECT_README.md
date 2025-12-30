# 上下班拼车小程序

## 项目简介

这是一个专为西安市内与西咸新区之间通勤人员打造的拼车信息发布平台。用户可以发布车找人或人找车的拼车信息，通过电话或微信联系，实现便捷拼车。

## 技术栈

- **前端框架**: uniapp + Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件库**: uview-plus
- **状态管理**: Pinia
- **后端**: 微信小程序云函数 + 云数据库

## 功能特性

### 1. 拼车大厅（首页）

- 实时展示所有拼车信息
- 支持按类型筛选（车找人/人找车）
- 支持按出发地和目的地筛选
- 下拉刷新、上拉加载更多
- 显示发布时间、剩余座位、联系人等关键信息

### 2. 发布拼车

- 支持两种类型：车找人、人找车
- 选择出发地、目的地
- 选择出发时间（日期+时间）
- 设置剩余座位数（车找人时）
- 填写联系方式（姓名、手机、微信）
- 添加备注说明

### 3. 拼车详情

- 查看完整的拼车信息
- 一键拨打电话
- 复制微信号
- 显示浏览次数
- 客服消息功能

### 4. 个人中心

- 显示用户信息和统计数据
- 我的发布列表
- 管理发布的信息（取消、删除）
- 绑定手机号
- 关于我们
- 联系客服

## 项目结构

```
src/
├── api/                    # API接口
│   └── carpool.ts         # 拼车相关接口
├── pages/                 # 页面
│   ├── index/            # 首页-拼车大厅
│   ├── publish/          # 发布页面
│   ├── detail/           # 详情页面
│   └── mine/             # 个人中心
├── components/           # 组件
├── stores/              # 状态管理
├── typings/             # 类型定义
│   └── carpool.d.ts    # 拼车类型定义
├── utils/              # 工具函数
│   └── request.ts     # 请求封装
├── static/            # 静态资源
│   └── tabbar/       # TabBar图标
├── App.vue           # 应用入口
├── main.ts          # 主入口文件
├── pages.json       # 页面配置
└── manifest.json    # 应用配置
```

## 数据结构设计

### 拼车信息表 (carpool)

```typescript
{
  id: string              // 主键
  type: 'offer' | 'request'  // 拼车类型
  fromLocation: string    // 出发地
  toLocation: string      // 目的地
  departureTime: string   // 出发时间
  seats?: number          // 座位数
  contact: {              // 联系方式
    name: string
    phone: string
    wechat?: string
  }
  remark?: string         // 备注
  userId: string          // 发布者ID
  createTime: string      // 发布时间
  status: string          // 状态
  viewCount: number       // 浏览次数
}
```

### 用户信息表 (users)

```typescript
{
  id: string              // 主键
  openid: string          // 微信openid
  nickName: string        // 昵称
  avatarUrl: string       // 头像
  phone?: string          // 手机号
  wechat?: string         // 微信号
  creditScore: number     // 信用分
  publishCount: number    // 发布次数
  registerTime: string    // 注册时间
}
```

## 云函数设计

需要创建以下云函数：

### 1. carpool-list (获取拼车列表)

- 输入：筛选条件、分页参数
- 输出：拼车信息列表
- 功能：支持按类型、地点筛选，分页返回

### 2. carpool-detail (获取拼车详情)

- 输入：拼车ID
- 输出：拼车详细信息
- 功能：返回完整信息，增加浏览次数

### 3. carpool-publish (发布拼车)

- 输入：拼车信息
- 输出：发布成功的ID
- 功能：创建新的拼车信息

### 4. carpool-update (更新拼车)

- 输入：拼车ID、更新内容
- 输出：更新结果
- 功能：更新拼车信息

### 5. carpool-cancel (取消拼车)

- 输入：拼车ID
- 输出：操作结果
- 功能：将状态设为已取消

### 6. carpool-delete (删除拼车)

- 输入：拼车ID
- 输出：操作结果
- 功能：删除拼车信息

### 7. user-info (获取用户信息)

- 输入：无（从context获取openid）
- 输出：用户信息
- 功能：返回当前用户信息

### 8. user-update (更新用户信息)

- 输入：用户信息
- 输出：更新结果
- 功能：更新用户信息

## 开发指南

### 环境要求

- Node.js 22.x
- pnpm 10.x

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
# 微信小程序
pnpm dev:mp-weixin

# H5
pnpm dev:h5

# App
pnpm dev:app
```

### 构建打包

```bash
# 微信小程序
pnpm build:mp-weixin

# H5
pnpm build:h5
```

## 待完成功能

### 必要功能

1. **云函数开发**
   - 创建上述所有云函数
   - 配置云数据库集合
   - 实现数据的增删改查

2. **TabBar图标**
   - 替换 `src/static/tabbar/` 目录下的图标文件
   - 建议尺寸：81x81px

3. **微信小程序配置**
   - 在 `manifest.json` 中填写小程序 appid
   - 配置服务器域名
   - 配置云开发环境ID

4. **用户授权登录**
   - 实现微信登录
   - 获取用户openid
   - 存储用户信息

### 可选优化

1. **功能增强**
   - 消息推送（拼车成功提醒）
   - 收藏功能
   - 评价系统
   - 举报功能
   - 黑名单机制

2. **体验优化**
   - 骨架屏加载
   - 图片懒加载
   - 请求防抖节流
   - 离线缓存

3. **数据分析**
   - 埋点统计
   - 用户行为分析
   - 热门路线分析

## 注意事项

1. **信息安全**
   - 手机号部分隐藏显示
   - 敏感信息加密存储
   - 防止信息爬取

2. **内容审核**
   - 发布内容文本审核
   - 违规内容过滤
   - 用户举报机制

3. **性能优化**
   - 列表分页加载
   - 图片压缩上传
   - 请求合并优化

4. **用户体验**
   - 表单验证友好提示
   - 网络异常处理
   - 空状态设计

## 联系方式

如有问题，请联系开发者。

## 许可证

MIT License
