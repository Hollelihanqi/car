# uniCloud 配置指南

## 📦 项目结构

```
uniCloud-aliyun/
├── cloudfunctions/          # 云函数目录
│   ├── carpool/            # 拼车业务云函数
│   │   ├── index.js
│   │   └── package.json
│   └── user/               # 用户业务云函数
│       ├── index.js
│       └── package.json
└── database/               # 数据库表结构定义
    ├── carpool.schema.json # 拼车表结构
    └── users.schema.json   # 用户表结构
```

## 🚀 快速开始

### 1. 创建 uniCloud 服务空间

1. 登录 [uniCloud Web控制台](https://unicloud.dcloud.net.cn/)
2. 创建阿里云服务空间（推荐）
3. 记录服务空间的 SpaceID

### 2. 关联服务空间

在 HBuilderX 中：
1. 右键点击项目根目录
2. 选择 `创建 uniCloud 云开发环境`
3. 选择 `阿里云`
4. 关联刚才创建的服务空间

### 3. 初始化数据库

#### 方式一：通过 Web 控制台

1. 进入 uniCloud Web控制台
2. 选择 `云数据库` → `新建表`
3. 分别创建两个表：
   - 表名：`carpool`，上传 `database/carpool.schema.json`
   - 表名：`users`，上传 `database/users.schema.json`

#### 方式二：通过 HBuilderX

1. 右键点击 `uniCloud-aliyun/database/carpool.schema.json`
2. 选择 `上传DB Schema`
3. 对 `users.schema.json` 重复上述操作

### 4. 上传云函数

1. 右键点击 `uniCloud-aliyun/cloudfunctions/carpool` 目录
2. 选择 `上传部署云函数`
3. 对 `user` 云函数重复上述操作

### 5. 配置微信小程序（可选）

如果使用微信登录功能，需要在 `user/index.js` 中配置：

```javascript
appid: 'YOUR_APPID',      // 替换为你的小程序 appid
secret: 'YOUR_SECRET',    // 替换为你的小程序 secret
```

## 📚 数据库表说明

### carpool 表（拼车信息表）

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| _id | string | 主键ID | 自动生成 |
| type | string | 类型：offer/request | ✓ |
| fromLocation | string | 出发地 | ✓ |
| toLocation | string | 目的地 | ✓ |
| departureTime | string | 出发时间 | ✓ |
| seats | int | 座位数 | - |
| contact | object | 联系方式 | ✓ |
| userId | string | 发布用户ID | ✓ |
| status | string | 状态 | 默认 active |
| viewCount | int | 浏览次数 | 默认 0 |
| remark | string | 备注 | - |
| createTime | timestamp | 创建时间 | 自动生成 |
| updateTime | timestamp | 更新时间 | 自动生成 |

### users 表（用户表）

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| _id | string | 主键ID | 自动生成 |
| openid | string | 微信 openid | ✓ |
| nickname | string | 昵称 | 默认值 |
| avatar | string | 头像URL | - |
| phone | string | 手机号 | - |
| createTime | timestamp | 创建时间 | 自动生成 |
| updateTime | timestamp | 更新时间 | 自动生成 |

## 🔌 API 使用示例

### 获取拼车列表

```typescript
import { getCarPoolList } from '@/api/carpool';

// 获取所有拼车信息
const list = await getCarPoolList({
  page: 1,
  pageSize: 10
});

// 筛选特定类型
const offers = await getCarPoolList({
  type: 'offer',
  page: 1,
  pageSize: 10
});

// 按地点筛选
const filtered = await getCarPoolList({
  fromLocation: '西安',
  toLocation: '咸阳',
  page: 1,
  pageSize: 10
});
```

### 发布拼车

```typescript
import { publishCarPool } from '@/api/carpool';

const result = await publishCarPool({
  type: 'offer',
  fromLocation: '西安市内',
  toLocation: '西咸新区',
  departureTime: '2024-01-01 18:00',
  seats: 2,
  contact: {
    name: '张三',
    phone: '13800138000'
  }
});

console.log('发布成功，ID:', result.id);
```

### 获取我的发布

```typescript
import { getMyCarPoolList } from '@/api/carpool';

const myList = await getMyCarPoolList({
  page: 1,
  pageSize: 10
});
```

### 更新拼车信息

```typescript
import { updateCarPool } from '@/api/carpool';

await updateCarPool('carpoolId', {
  seats: 3,
  remark: '可以顺路带货'
});
```

### 取消/删除拼车

```typescript
import { cancelCarPool, deleteCarPool } from '@/api/carpool';

// 取消
await cancelCarPool('carpoolId');

// 删除
await deleteCarPool('carpoolId');
```

## 🔐 权限说明

### carpool 表权限

- **读取**：所有人可读
- **创建**：需要登录
- **更新**：仅发布者本人
- **删除**：仅发布者本人

### users 表权限

- **读取**：仅本人可读
- **创建**：系统创建，用户不可创建
- **更新**：仅本人可更新
- **删除**：不可删除

## ⚠️ 注意事项

1. **云函数冷启动**：首次调用云函数可能需要 2-3 秒，之后会很快
2. **并发限制**：免费版有并发数限制，建议升级到付费版
3. **数据库索引**：建议为常用查询字段创建索引（userId、status、createTime）
4. **定时任务**：可以配置定时任务自动将过期的拼车信息标记为 expired
5. **数据备份**：定期在 Web 控制台备份数据库

## 🎯 下一步优化

1. **添加云端定时任务**：自动过期处理
2. **添加实时推送**：使用 uniCloud 的实时数据库功能
3. **添加云存储**：用于上传图片等文件
4. **添加统计分析**：记录用户行为数据
5. **添加敏感词过滤**：使用云函数公共模块

## 📞 技术支持

- [uniCloud 官方文档](https://uniapp.dcloud.net.cn/uniCloud/)
- [uniCloud 社区](https://ask.dcloud.net.cn/)
