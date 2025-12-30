# 云函数开发指南

本文档详细说明如何为拼车小程序开发云函数。

## 云开发环境准备

### 1. 开通云开发

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入小程序后台
3. 点击"云开发" -> "开通"
4. 创建云开发环境（建议创建两个：开发环境、生产环境）
5. 记录环境ID，填写到 `manifest.json` 中

### 2. 安装云开发工具

```bash
npm install -g @cloudbase/cli
```

### 3. 登录云开发

```bash
tcb login
```

## 云数据库设计

### 创建数据集合

在云开发控制台创建以下集合：

#### 1. carpool（拼车信息表）

```json
{
  "_id": "自动生成",
  "_openid": "用户openid",
  "type": "offer 或 request",
  "fromLocation": "出发地",
  "toLocation": "目的地",
  "departureTime": "出发时间",
  "seats": 2,
  "contact": {
    "name": "张三",
    "phone": "13800138000",
    "wechat": "zhangsan123"
  },
  "remark": "备注说明",
  "userId": "用户ID",
  "createTime": "创建时间",
  "status": "active/expired/cancelled",
  "viewCount": 0
}
```

**索引设置**：

- `type`: 升序索引
- `fromLocation`: 升序索引
- `toLocation`: 升序索引
- `createTime`: 降序索引
- `status`: 升序索引

#### 2. users（用户信息表）

```json
{
  "_id": "自动生成",
  "_openid": "微信openid",
  "nickName": "用户昵称",
  "avatarUrl": "头像URL",
  "phone": "手机号",
  "wechat": "微信号",
  "creditScore": 100,
  "publishCount": 0,
  "registerTime": "注册时间"
}
```

**索引设置**：

- `_openid`: 升序索引（唯一）

## 云函数实现

### 云函数目录结构

```
cloudfunctions/
├── carpool-list/          # 获取拼车列表
├── carpool-detail/        # 获取拼车详情
├── carpool-publish/       # 发布拼车
├── carpool-update/        # 更新拼车
├── carpool-cancel/        # 取消拼车
├── carpool-delete/        # 删除拼车
├── carpool-my/            # 我的发布
├── user-info/             # 获取用户信息
└── user-update/           # 更新用户信息
```

### 示例：carpool-list 云函数

#### 1. 创建云函数

在云开发控制台或使用命令行创建：

```bash
tcb fn create carpool-list
```

#### 2. index.js 实现

```javascript
// cloudfunctions/carpool-list/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { type, fromLocation, toLocation, page = 1, pageSize = 20 } = event;

  try {
    // 构建查询条件
    const where = {
      status: 'active' // 只查询有效的
    };

    if (type && type !== 'all') {
      where.type = type;
    }

    if (fromLocation) {
      where.fromLocation = fromLocation;
    }

    if (toLocation) {
      where.toLocation = toLocation;
    }

    // 查询总数
    const countResult = await db.collection('carpool').where(where).count();

    const total = countResult.total;

    // 分页查询
    const skip = (page - 1) * pageSize;
    const result = await db
      .collection('carpool')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    return {
      code: 0,
      message: 'success',
      data: {
        list: result.data,
        total,
        page,
        pageSize,
        hasMore: skip + result.data.length < total
      }
    };
  } catch (error) {
    console.error('查询失败', error);
    return {
      code: -1,
      message: error.message,
      data: null
    };
  }
};
```

#### 3. package.json

```json
{
  "name": "carpool-list",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

### 示例：carpool-publish 云函数

```javascript
// cloudfunctions/carpool-publish/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  const { type, fromLocation, toLocation, departureTime, seats, contact, remark } = event;

  try {
    // 验证必填字段
    if (!type || !fromLocation || !toLocation || !departureTime || !contact) {
      return {
        code: -1,
        message: '缺少必填字段',
        data: null
      };
    }

    // 插入数据
    const result = await db.collection('carpool').add({
      data: {
        _openid: openid,
        type,
        fromLocation,
        toLocation,
        departureTime,
        seats: seats || 0,
        contact,
        remark: remark || '',
        userId: openid,
        createTime: new Date().toISOString(),
        status: 'active',
        viewCount: 0
      }
    });

    // 更新用户发布次数
    await db
      .collection('users')
      .where({
        _openid: openid
      })
      .update({
        data: {
          publishCount: _.inc(1)
        }
      });

    return {
      code: 0,
      message: 'success',
      data: {
        id: result._id
      }
    };
  } catch (error) {
    console.error('发布失败', error);
    return {
      code: -1,
      message: error.message,
      data: null
    };
  }
};
```

### 示例：carpool-detail 云函数

```javascript
// cloudfunctions/carpool-detail/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { id } = event;

  try {
    // 查询详情
    const result = await db.collection('carpool').doc(id).get();

    if (!result.data) {
      return {
        code: -1,
        message: '记录不存在',
        data: null
      };
    }

    // 增加浏览次数
    await db
      .collection('carpool')
      .doc(id)
      .update({
        data: {
          viewCount: _.inc(1)
        }
      });

    return {
      code: 0,
      message: 'success',
      data: result.data
    };
  } catch (error) {
    console.error('查询失败', error);
    return {
      code: -1,
      message: error.message,
      data: null
    };
  }
};
```

### 示例：user-info 云函数

```javascript
// cloudfunctions/user-info/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  try {
    // 查询用户信息
    const result = await db
      .collection('users')
      .where({
        _openid: openid
      })
      .get();

    // 如果用户不存在，创建新用户
    if (result.data.length === 0) {
      const createResult = await db.collection('users').add({
        data: {
          _openid: openid,
          nickName: '微信用户',
          avatarUrl: '',
          creditScore: 100,
          publishCount: 0,
          registerTime: new Date().toISOString()
        }
      });

      const newUser = await db.collection('users').doc(createResult._id).get();

      return {
        code: 0,
        message: 'success',
        data: newUser.data
      };
    }

    return {
      code: 0,
      message: 'success',
      data: result.data[0]
    };
  } catch (error) {
    console.error('查询失败', error);
    return {
      code: -1,
      message: error.message,
      data: null
    };
  }
};
```

## 部署云函数

### 方法1：通过云开发控制台

1. 在云开发控制台选择"云函数"
2. 点击"新建云函数"
3. 上传代码文件
4. 点击"部署"

### 方法2：通过命令行

```bash
# 进入云函数目录
cd cloudfunctions/carpool-list

# 安装依赖
npm install

# 部署
tcb fn deploy carpool-list
```

### 方法3：通过开发者工具

1. 右键点击云函数目录
2. 选择"上传并部署：云端安装依赖"

## 前端调用云函数

### 1. 初始化云开发

在 `src/main.ts` 中：

```typescript
// 初始化云开发
wx.cloud.init({
  env: 'your-env-id', // 云开发环境ID
  traceUser: true
});
```

### 2. 更新请求工具

修改 `src/utils/request.ts`：

```typescript
export const cloudFunction = async (name: string, data?: any) => {
  try {
    const res = await wx.cloud.callFunction({
      name,
      data
    });

    if (res.result.code === 0) {
      return res.result.data;
    } else {
      throw new Error(res.result.message);
    }
  } catch (error) {
    console.error(`云函数${name}调用失败`, error);
    throw error;
  }
};
```

### 3. 更新API接口

修改 `src/api/carpool.ts`：

```typescript
import { cloudFunction } from '@/utils/request';

export const getCarPoolList = (params: FilterParams & PageParams) => {
  return cloudFunction('carpool-list', params);
};

export const publishCarPool = (data: Partial<CarPoolInfo>) => {
  return cloudFunction('carpool-publish', data);
};

// ... 其他接口
```

## 权限配置

在云数据库集合的权限设置中：

### carpool 集合权限

```json
{
  "read": true, // 所有人可读
  "write": "auth.openid == doc._openid" // 只有创建者可写
}
```

### users 集合权限

```json
{
  "read": "auth.openid == doc._openid", // 只能读自己的
  "write": "auth.openid == doc._openid" // 只能写自己的
}
```

## 测试云函数

### 1. 在云开发控制台测试

1. 选择要测试的云函数
2. 点击"测试"
3. 输入测试参数
4. 查看运行结果

### 2. 测试参数示例

**carpool-list**:

```json
{
  "type": "offer",
  "fromLocation": "西安市内",
  "page": 1,
  "pageSize": 20
}
```

**carpool-publish**:

```json
{
  "type": "offer",
  "fromLocation": "西安市内",
  "toLocation": "西咸新区",
  "departureTime": "2024-01-01 18:00",
  "seats": 2,
  "contact": {
    "name": "测试用户",
    "phone": "13800138000",
    "wechat": "test123"
  },
  "remark": "测试备注"
}
```

## 常见问题

### 1. 云函数超时

- 默认超时时间为20秒
- 可在云开发控制台调整超时时间
- 优化查询逻辑，减少执行时间

### 2. 并发限制

- 免费版有并发限制
- 升级套餐增加并发量
- 合理使用缓存减少调用

### 3. 数据库连接数

- 注意关闭不用的连接
- 使用连接池管理

### 4. 日志查看

- 在云开发控制台查看云函数日志
- 使用 console.log 输出调试信息

## 性能优化建议

1. **数据库查询优化**
   - 建立合适的索引
   - 避免全表扫描
   - 使用聚合查询

2. **云函数优化**
   - 减少冷启动时间
   - 复用数据库连接
   - 使用云函数固定IP

3. **缓存策略**
   - 热门数据使用云缓存
   - 客户端本地缓存
   - 设置合理的过期时间

## 安全建议

1. **输入验证**
   - 验证所有输入参数
   - 防止SQL注入
   - 过滤敏感字符

2. **权限控制**
   - 设置合理的数据库权限
   - 验证用户身份
   - 防止越权访问

3. **数据加密**
   - 敏感信息加密存储
   - 使用HTTPS传输
   - 定期备份数据

## 参考资源

- [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云数据库文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html)
- [云函数文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html)
