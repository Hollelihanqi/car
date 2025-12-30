# 上下班拼车小程序

<div align="center">

 **西安市内  西咸新区** 通勤拼车信息平台

![](https://img.shields.io/badge/uniapp-3.0-green)
![](https://img.shields.io/badge/vue-3.4-brightgreen)
![](https://img.shields.io/badge/typescript-5.x-blue)
![](https://img.shields.io/badge/vite-5.x-purple)

</div>

##  项目简介

专为西安市内与西咸新区之间通勤人员打造的拼车信息发布平台。用户可以发布"车找人"或"人找车"信息，通过电话或微信联系，实现便捷、环保的拼车出行。

###  核心特性

-  **信息发布** - 快速发布拼车需求或提供拼车服务
-  **智能筛选** - 按类型、出发地、目的地筛选拼车信息
-  **便捷联系** - 一键拨打电话或复制微信号
-  **个人中心** - 管理发布信息，查看统计数据
-  **精美UI** - 清新简洁的界面设计

##  快速开始

### 环境要求

- Node.js 22.x
- pnpm 10.x
- 微信开发者工具

### 安装运行

\\\ash
# 1. 安装依赖
pnpm install

# 2. 运行开发环境
pnpm dev:mp-weixin

# 3. 在微信开发者工具中打开
# 项目路径: dist/dev/mp-weixin
\\\

>  **首次运行提示**：需要先准备 TabBar 图标或临时禁用 TabBar 配置。详见 [快速启动指南](QUICK_START.md)

##  文档导航

-  [快速启动指南](QUICK_START.md) - 5分钟快速上手
-  [项目详细说明](PROJECT_README.md) - 完整的项目介绍
-  [云函数开发指南](docs/CLOUD_FUNCTION_GUIDE.md) - 后端开发教程
-  [开发完成总结](DEVELOPMENT_SUMMARY.md) - 项目进度和待办事项

##  脚本命令

\\\ash
# 开发
pnpm dev:mp-weixin      # 微信小程序
pnpm dev:h5             # H5

# 构建
pnpm build:mp-weixin    # 微信小程序
pnpm build:h5           # H5

# 代码检查
pnpm lint               # 代码检查
pnpm lint:fix           # 自动修复
\\\

##  许可证

MIT License

---

**祝您开发顺利！**

