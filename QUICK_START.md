# 快速启动指南

## 项目状态

✅ 已完成：

- 项目配置（package.json, manifest.json, pages.json）
- 类型定义和API接口设计
- 四个核心页面实现：
  - 首页（拼车大厅）
  - 发布页面
  - 详情页面
  - 个人中心
- 完整的UI界面和交互逻辑
- 模拟数据展示

⚠️ 待完成：

- TabBar图标（需要准备6个PNG图标文件）
- 云函数开发（需要创建云开发环境）
- 小程序appid配置
- 真实数据对接

## 立即开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 临时禁用TabBar（快速测试）

如果想立即查看效果，可以先注释掉 TabBar 配置。

编辑 `src/pages.json`，找到 `tabBar` 部分并注释：

```json
{
  "pages": [...],
  "globalStyle": {...},
  "easycom": {...}

  // 临时注释，等图标准备好后再启用
  // "tabBar": {
  //   ...
  // }
}
```

### 3. 运行项目

```bash
# 开发微信小程序
pnpm dev:mp-weixin
```

### 4. 在微信开发者工具中打开

1. 打开微信开发者工具
2. 选择"导入项目"
3. 项目路径选择：`E:\Dr\car\dist\dev\mp-weixin`
4. AppID：选择"测试号"或填写你的小程序AppID
5. 点击"导入"

### 5. 查看效果

项目会自动打开首页，你可以：

- 查看拼车列表（使用模拟数据）
- 点击筛选条件测试交互
- 点击列表项查看详情
- 手动修改URL测试其他页面

测试其他页面，在微信开发者工具的控制台输入：

```javascript
// 测试发布页
uni.navigateTo({ url: '/pages/publish/publish' });

// 测试个人中心
uni.navigateTo({ url: '/pages/mine/mine' });

// 测试详情页
uni.navigateTo({ url: '/pages/detail/detail?id=test-1' });
```

## 完整部署流程

如果要完整使用所有功能，按以下步骤操作：

### 第一步：准备TabBar图标

在 `src/static/tabbar/` 目录下准备6个PNG图标：

- home.png & home-active.png
- publish.png & publish-active.png
- mine.png & mine-active.png

参考：[图标获取建议](src/static/tabbar/SETUP_REQUIRED.md)

### 第二步：配置小程序

1. 在微信公众平台注册小程序
2. 获取 AppID
3. 编辑 `src/manifest.json`，找到 `mp-weixin` 部分：

```json
"mp-weixin" : {
    "appid" : "你的小程序AppID",
    "setting" : {
        "urlCheck" : false
    },
    "usingComponents" : true
},
```

### 第三步：开通云开发

1. 在微信公众平台进入小程序后台
2. 开通云开发服务
3. 创建云开发环境（建议：开发环境+生产环境）
4. 记录环境ID

### 第四步：创建云数据库

参考：[云函数开发指南](docs/CLOUD_FUNCTION_GUIDE.md)

在云开发控制台创建两个集合：

- `carpool`（拼车信息表）
- `users`（用户信息表）

### 第五步：部署云函数

参考：[云函数开发指南](docs/CLOUD_FUNCTION_GUIDE.md)

创建并部署以下云函数：

- carpool-list（获取列表）
- carpool-detail（获取详情）
- carpool-publish（发布信息）
- carpool-cancel（取消信息）
- carpool-delete（删除信息）
- user-info（用户信息）

### 第六步：对接真实API

编辑 `src/utils/request.ts`，实现云函数调用。

编辑各页面文件，将模拟数据替换为真实API调用。

## 目录说明

```
car/
├── src/                        # 源代码
│   ├── pages/                 # 页面
│   │   ├── index/            # 首页
│   │   ├── publish/          # 发布
│   │   ├── detail/           # 详情
│   │   └── mine/             # 个人中心
│   ├── api/                  # API接口
│   ├── typings/              # 类型定义
│   ├── static/               # 静态资源
│   │   └── tabbar/          # TabBar图标
│   ├── App.vue              # 应用入口
│   ├── main.ts              # 主入口
│   ├── pages.json           # 页面配置
│   └── manifest.json        # 应用配置
├── docs/                     # 文档
│   └── CLOUD_FUNCTION_GUIDE.md  # 云函数指南
├── PROJECT_README.md        # 项目说明
├── package.json            # 项目配置
└── README.md              # 原始README

```

## 常见问题

### Q1: 运行后看不到TabBar？

A: 需要准备图标文件，或者先注释掉 tabBar 配置。

### Q2: 数据不显示？

A: 当前使用模拟数据。真实数据需要配置云函数。

### Q3: 无法拨打电话？

A: 在真机上测试，模拟器可能不支持。

### Q4: 如何切换页面？

A: 注释TabBar后，使用 `uni.navigateTo` 手动跳转。

## 下一步

1. ✅ 快速查看效果（注释TabBar，直接运行）
2. 🔲 准备TabBar图标
3. 🔲 配置小程序AppID
4. 🔲 开通云开发
5. 🔲 创建云数据库
6. 🔲 开发云函数
7. 🔲 对接真实数据
8. 🔲 测试完整流程
9. 🔲 提交审核上线

## 技术支持

- 详细文档：`PROJECT_README.md`
- 云函数指南：`docs/CLOUD_FUNCTION_GUIDE.md`
- TabBar图标说明：`src/static/tabbar/SETUP_REQUIRED.md`

祝开发顺利！🚀
