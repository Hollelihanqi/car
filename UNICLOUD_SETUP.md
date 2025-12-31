# uniCloud 拼车小程序 - 快速入门

## 🎉 已完成的工作

您的项目已经完整集成了 uniCloud 云开发能力，包括：

✅ **云函数**（2个）

- `carpool` - 处理所有拼车业务逻辑
- `user` - 处理用户相关业务逻辑

✅ **数据库表结构**（2个）

- `carpool` - 拼车信息表
- `users` - 用户表

✅ **API 接口封装**

- 已将所有 HTTP 请求改为云函数调用
- 统一的错误处理和响应格式

## 🚀 3 步开始使用

### 步骤 1：创建并关联服务空间

1. 打开 HBuilderX
2. 右键点击项目根目录
3. 选择 `创建 uniCloud 云开发环境`
4. 选择 `阿里云` → 创建或关联服务空间

### 步骤 2：初始化数据库

在 HBuilderX 中：

1. 右键 `uniCloud-aliyun/database/carpool.schema.json`
2. 选择 `上传DB Schema`
3. 右键 `uniCloud-aliyun/database/users.schema.json`
4. 选择 `上传DB Schema`

### 步骤 3：上传云函数

1. 右键 `uniCloud-aliyun/cloudfunctions/carpool`
2. 选择 `上传部署云函数`
3. 右键 `uniCloud-aliyun/cloudfunctions/user`
4. 选择 `上传部署云函数`

## ✅ 完成！

现在你可以：

- 运行项目到微信开发者工具
- 所有 API 调用都会自动使用云函数
- 数据存储在云端数据库

## 📝 云函数功能列表

### carpool 云函数

| 操作     | action       | 说明               |
| -------- | ------------ | ------------------ |
| 获取列表 | getList      | 支持筛选和分页     |
| 获取详情 | getDetail    | 根据 ID 获取       |
| 发布拼车 | publish      | 创建新的拼车信息   |
| 更新拼车 | update       | 修改拼车信息       |
| 取消拼车 | cancel       | 将状态改为已取消   |
| 删除拼车 | delete       | 物理删除           |
| 我的发布 | getMyList    | 获取当前用户的发布 |
| 增加浏览 | increaseView | 浏览次数+1         |

### user 云函数

| 操作     | action  | 说明             |
| -------- | ------- | ---------------- |
| 获取信息 | getInfo | 获取当前用户信息 |
| 更新信息 | update  | 更新用户信息     |
| 微信登录 | wxLogin | 微信小程序登录   |

## 🔧 配置微信登录（可选）

如需使用微信登录，编辑 `user/index.js`：

```javascript
appid: 'wx1234567890',        // 你的小程序 appid
secret: 'abc123xyz456',       // 你的小程序 secret
```

## 📖 使用示例

### 在页面中使用

```vue
<script setup lang="ts">
import { getCarPoolList, publishCarPool } from '@/api/carpool';

// 获取列表
const loadList = async () => {
  const result = await getCarPoolList({
    page: 1,
    pageSize: 10
  });
  console.log('列表:', result.list);
};

// 发布拼车
const publish = async () => {
  const result = await publishCarPool({
    type: 'offer',
    fromLocation: '西安市内',
    toLocation: '西咸新区',
    departureTime: '今天 18:00',
    seats: 2,
    contact: {
      name: '张三',
      phone: '13800138000'
    }
  });
  console.log('发布成功，ID:', result.id);
};
</script>
```

## 🎯 后续优化建议

1. **添加索引**
   - 在 uniCloud 控制台为 `userId`、`status`、`createTime` 字段创建索引
   - 提升查询性能

2. **定时任务**
   - 创建定时云函数，每天自动将过期的拼车标记为 expired

3. **实时推送**
   - 使用 uniCloud 的实时数据库功能
   - 新发布的拼车信息实时推送给用户

4. **图片上传**
   - 集成云存储功能
   - 允许用户上传车辆照片

5. **数据统计**
   - 添加埋点统计
   - 分析用户行为

## ❓ 常见问题

### Q: 云函数调用失败？

A: 检查是否已上传云函数，并且服务空间已关联

### Q: 数据库操作报错？

A: 检查是否已上传 DB Schema，并且表已创建

### Q: 如何查看云函数日志？

A: 在 uniCloud Web 控制台 → 云函数 → 日志

### Q: 如何调试云函数？

A: 在 HBuilderX 中右键云函数 → 本地运行 → 手机运行

## 📚 相关文档

- [uniCloud 官方文档](https://uniapp.dcloud.net.cn/uniCloud/)
- [云函数开发指南](https://uniapp.dcloud.net.cn/uniCloud/cf-functions.html)
- [云数据库文档](https://uniapp.dcloud.net.cn/uniCloud/cf-database.html)

---

🎉 **恭喜！你已经完成了 uniCloud 的集成！**
